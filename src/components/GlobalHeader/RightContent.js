/* global $crisp */
import React, { PureComponent } from 'react';
import { FormattedMessage, setLocale, getLocale } from 'umi/locale';
import {
  LogoutOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { Spin, Tag, Menu, Dropdown, Avatar } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import styles from './index.less';

// const bugEvent = () => {
//   $crisp.push(['do', 'chat:show']);
//   $crisp.push(['do', 'chat:open']);
//   $crisp.push(['do', 'message:send', ['text', "I'd like to report a bug."]]);
// };

const chatEvent = () => {
  $crisp.push(['do', 'chat:show']);
  $crisp.push(['do', 'chat:open']);
  // $crisp.push(['do', 'message:send', ['text', "I'd like to report a bug."]]);
};

const ContactSupport = () => <QuestionCircleOutlined />;
export default class GlobalHeaderRight extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  changLang = () => {
    const locale = getLocale();
    if (!locale || locale === 'zh-CN') {
      setLocale('en-US');
    } else {
      setLocale('zh-CN');
    }
  };

  render() {
    const {
      currentUser,

      onMenuClick,
      theme,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userinfo">
          <SettingOutlined />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item key="logout">
          <LogoutOutlined />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );

    const support = (
      <Menu>
        <Menu.Item onClick={chatEvent} key="liveChat">
          <MessageOutlined />
          Live Chat
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item onClick={() => window.open('https://help.deephire.com', '_blank')} key="support">
          <BookOutlined />
          Help Center
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <Dropdown overlay={support}>
          <span className={`${styles.action} ${styles.account}`}>
            <span>
              <ContactSupport />
            </span>
          </span>
        </Dropdown>
        {currentUser.name ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.picture}
                alt="avatar"
              />
              <span className={styles.name}>{currentUser.name}</span>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        {/* <Button
          size="small"
          ghost={theme === 'dark'}
          style={{
            margin: '0 8px',
          }}
          onClick={() => {
            this.changLang();
          }}
        >
          <FormattedMessage id="navbar.lang" />
        </Button> */}
      </div>
    );
  }
}
