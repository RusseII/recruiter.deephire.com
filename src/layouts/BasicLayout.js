/* eslint-disable camelcase */
/* global $crisp */
import React from 'react';
import { Layout, Alert, Modal } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { formatMessage } from 'umi/locale';
import { StripeProvider } from 'react-stripe-elements';
import * as Sentry from '@sentry/browser';
import SiderMenu from '@/components/SiderMenu';
import Authorized from '@/utils/Authorized';
import SettingDrawer from '@/components/SettingDrawer';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import GlobalContext from './MenuContext';
import Exception403 from '../pages/Exception/403';
import { getProduct, getRecruiterProfile, getSubscriptions } from '@/services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import UpgradeButton from '@/components/Upgrade/UpgradeButton';
import BillingCards from '@/pages/Billing/BillingCards';

Sentry.init({ dsn: 'https://ba050977b865461497954ae331877145@sentry.io/5187820' });
const { Content } = Layout;

GlobalContext.displayName = 'Global Context';

// Conversion router to menu.
function formatter(data, parentPath = '', parentAuthority, parentName) {
  return data.map(item => {
    let locale = 'menu';
    if (parentName && item.name) {
      locale = `${parentName}.${item.name}`;
    } else if (item.name) {
      locale = `menu.${item.name}`;
    } else if (parentName) {
      locale = parentName;
    }
    const result = {
      ...item,
      locale,
      authority: item.authority || parentAuthority,
    };
    if (item.routes) {
      const children = formatter(item.routes, `${parentPath}${item.path}/`, item.authority, locale);
      // Reduce memory usage
      result.children = children;
    }
    delete result.routes;
    return result;
  });
}

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  state = {
    rendering: true,
    isMobile: false,
    interviews: [],
    liveInterviews: [],
    videos: [],
    shareLinks: [],
    stripeProduct: { metadata: { allowedInterviews: null } },
    recruiterProfile: null,
  };

  async componentDidMount() {
    $crisp.push(['do', 'chat:hide']);
    const recruiterProfile = await getRecruiterProfile();
    this.setState({ recruiterProfile });

    // eslint-disable-next-line camelcase
    if (recruiterProfile?.app_metadata) {
      const { role } = recruiterProfile.app_metadata;
      if (role === 'admin' || role === 'user') {
        setAuthority(role);
        reloadAuthorized();
      }
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'setting/getSetting',
    });

    this.setStripeProduct();
    this.setStripeSubscription();

    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false,
      });
    });
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        });
      }
    });
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { isMobile } = this.state;
    const { collapsed } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    const {
      interviews,
      liveInterviews,
      videos,
      shareLinks,
      stripeProduct,
      recruiterProfile,
      stripeSubscription,
    } = this.state;
    const setInterviews = interviews => {
      this.setState({ interviews });
    };

    const setLiveInterviews = liveInterviews => {
      this.setState({ liveInterviews });
    };

    const setVideos = videos => {
      this.setState({ videos });
    };

    const setShareLinks = shareLinks => {
      this.setState({ shareLinks });
    };

    const reloadProductAndSubscriptions = () => {
      this.setStripeProduct();
      this.setStripeSubscription();
    };

    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
      interviews,
      setInterviews,
      liveInterviews,
      setLiveInterviews,
      videos,
      setVideos,
      shareLinks,
      setShareLinks,
      stripeProduct,
      stripeSubscription,
      recruiterProfile,
      reloadProductAndSubscriptions,
    };
  }

  async setStripeProduct() {
    const stripeProduct = await getProduct();
    if (stripeProduct) {
      this.setState({ stripeProduct });
    } else {
      const noStripe = { trialExpired: true, metadata: { allowedInterviews: '1' } };
      this.setState({ stripeProduct: noStripe });
    }
  }

  async setStripeSubscription() {
    const stripeSubscription = await getSubscriptions();
    if (stripeSubscription) {
      this.setState({ stripeSubscription });
    } else {
      this.setState({ stripeSubscription: null });
    }
  }

  getMenuData() {
    const {
      route: { routes },
    } = this.props;
    return formatter(routes);
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  }

  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
      pathToRegexp(key).test(pathname)
    );
    return this.breadcrumbNameMap[pathKey];
  };

  getPageTitle = pathname => {
    const currRouterData = this.matchParamsPath(pathname);

    if (!currRouterData) {
      return 'DeepHire';
    }
    const message = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });
    return `${message} - DeepHire`;
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: '24px 24px 0',
      paddingTop: fixedHeader ? 64 : 0,
    };
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer() {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    const { rendering } = this.state;
    if ((rendering || process.env.NODE_ENV === 'production') && APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  }

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
    } = this.props;
    const { isMobile, stripeSubscription, stripeProduct } = this.state;
    const { trialExpired } = stripeProduct;
    const {
      status: currentSubscriptionStatus,
      default_payment_method: defaultPaymentMethod,
      customer,
    } = stripeSubscription?.data?.[0] || {};
    let trialExpiresIn = null;
    if (stripeSubscription?.data?.[0]?.trial_end) {
      const trialEnd = stripeSubscription?.data?.[0]?.trial_end;
      const time = trialEnd - Date.now() / 1000;

      const days = Math.floor(time / 86400);
      trialExpiresIn = days;
    }

    // TODO - REMOVE customer !== 'cus_GlZ9vXy9AyWrSW' on May 24 2020
    // This is added because they were on a 'trial' in stripe, which is incorrect
    const trial =
      currentSubscriptionStatus === 'trialing' &&
      !defaultPaymentMethod &&
      customer !== 'cus_GlZ9vXy9AyWrSW';
    const isTop = PropsLayout === 'topmenu';
    const menuData = this.getMenuData();
    const routerConfig = this.matchParamsPath(pathname);
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            Authorized={Authorized}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <ExpiredModal visible={trialExpired} />
          {trial && (
            <Alert
              style={{ textAlign: 'center' }}
              message={
                <div>
                  {`Your trial ends in ${trialExpiresIn} days`}

                  <UpgradeButton style={{ marginLeft: 8 }} size="small" text="Upgrade Now" />
                </div>
              }
              banner
              closable
            />
          )}
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content style={this.getContentStyle()}>
            <Authorized authority={routerConfig.authority} noMatch={<Exception403 />}>
              {children}
            </Authorized>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <>
        <StripeProvider apiKey="pk_live_ku7cHGjH70SiUiDYjUr7MnoG">
          <>
            <DocumentTitle title={this.getPageTitle(pathname)}>
              <ContainerQuery query={query}>
                {params => (
                  <GlobalContext.Provider value={this.getContext()}>
                    <div className={classNames(params)}>{layout}</div>
                  </GlobalContext.Provider>
                )}
              </ContainerQuery>
            </DocumentTitle>
            {this.renderSettingDrawer()}
          </>
        </StripeProvider>
      </>
    );
  }
}

const ExpiredModal = ({ visible }) => {
  return (
    <Modal
      width={800}
      closable={false}
      visible={visible}
      footer={null}
      title="Trial Ended, please pick a plan to continue using DeepHire"
    >
      <BillingCards />
    </Modal>
  );
};

export default connect(({ global, setting }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  ...setting,
}))(BasicLayout);
