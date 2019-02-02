import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, List, Checkbox, Card } from 'antd';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getTimeDistance } from '@/utils/utils';
import { getShortListData } from '@/services/api';

import styles from './ShortListAnalytics.less';
import ShortListAnalyticsCard from '../../components/ShortListAnalyticsCard';
import ShortListStatsCard from '../../components/ShortListStatsCard';

const ProportionSales = React.lazy(() => import('./ProportionSales'));

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class ShortListAnalytics extends Component {
  state = {
    rangePickerValue: getTimeDistance('year'),
  };

  componentDidMount() {
    getShortListData().then(r => this.setState({ analyticsData: r }));
  }

  handleChangeCandidateStatusPie = e => {
    this.setState({
      candidateStatus: e.target.value,
    });
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const { analyticsData } = this.state;
    if (!analyticsData) {
      return null;
    }

    const views = analyticsData.clicks.length;

    const candidateList = analyticsData.list;

    const { loading } = this.props;
    const { candidateStatus } = this.state;

    const candidateStatusData = [
      { x: 'Reviewed', y: 5 },
      { x: 'Not Seen', y: 1 },
      { x: 'Not Reviewed', y: 3 },
    ];

    const candidateStatusReviewData = [
      { x: 'Accepted', y: 3 },
      { x: 'Declined', y: 1 },
      { x: 'Meh', y: 2 },
    ];

    let salesPieData;
    if (candidateStatus === 'all') {
      salesPieData = candidateStatusData;
    } else {
      salesPieData =
        candidateStatus === 'complete' ? candidateStatusReviewData : candidateStatusData;
    }

    return (
      <GridContent>
        <PageHeaderWrapper title={`Short List - ${analyticsData.email}`}>
          <Card className={styles.shortListStatsCard}>
            <div className={styles.shortListTitle}>Short List Statistics</div>
            <Row gutter={16}>
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <Suspense fallback={null}>
                  <ProportionSales
                    title="Candidates status"
                    candidateStatus={candidateStatus}
                    loading={loading}
                    salesPieData={salesPieData}
                    handleChangeSalesType={this.handleChangeCandidateStatusPie}
                  />
                </Suspense>
              </Col>
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <ShortListStatsCard views={views} />
              </Col>
            </Row>
          </Card>

          <Card className={styles.candidatesTitleCard}>
            <div className={styles.candidatesTitle}>Candidates</div>
          </Card>
          <div className={styles.cardList}>
            <Checkbox.Group style={{ width: '100%' }} onChange={this.cardSelectOnChange}>
              <List
                rowKey="id"
                style={{ marginTop: 24 }}
                grid={{ gutter: 24, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                loading={loading}
                dataSource={candidateList}
                renderItem={item => (
                  <List.Item key={item.id}>
                    <ShortListAnalyticsCard item={item} />
                  </List.Item>
                )}
              />
            </Checkbox.Group>
          </div>
        </PageHeaderWrapper>
      </GridContent>
    );
  }
}

export default ShortListAnalytics;
