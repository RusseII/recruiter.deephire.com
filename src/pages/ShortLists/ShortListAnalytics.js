import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, List, Checkbox, Card, Statistic, Rate, Divider } from 'antd';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getTimeDistance } from '@/utils/utils';
import { getShortListData } from '@/services/api';

import styles from './ShortListAnalytics.less';

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

    const filteredData = analyticsData.list;
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
        <PageHeaderWrapper title={`Short List - sent to ${analyticsData.email}`}>
          <Card className={styles.shortListStatsCard}>
            <div className={styles.shortListTitle}>Short List Statistics</div>
            <Row gutter={16}>
              <Col span={12}>
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
              <Col span={12}>
                <Card className={styles.shortListStatsCardStats}>
                  <Row>
                    <Col span={8}>
                      <div className={styles.shortListStats}>Views</div>
                    </Col>
                    <Col span={4}>
                      <div className={styles.shortListStatsValue}>20</div>
                    </Col>
                  </Row>
                  <Divider />
                  <Row>
                    <Col span={8}>
                      <div className={styles.shortListStats}> Time Spent</div>
                    </Col>
                    <Col>
                      <div className={styles.shortListStatsValue}>20 minutes</div>
                    </Col>
                  </Row>
                  <Divider />
                  <Row>
                    <Col span={8}>
                      <div className={styles.shortListStats}>Passed</div>
                    </Col>
                    <Col>
                      <div className={styles.shortListStatsValue}>3/5 Candidates</div>
                    </Col>
                  </Row>
                </Card>
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
                dataSource={filteredData}
                renderItem={item => (
                  <List.Item key={item.id}>
                    <Card
                      id={item.id}
                      className={styles.candidateAnalyticsCard}
                      subTitle={item.candidate_email}
                      bordered={false}
                      style={{ backgroundColor: '#fff' }}
                    >
                      <div className={styles.title}>{item.user_name}</div>
                      <div className={styles.subtitle}>{item.candidate_email}</div>
                      <Row gutter={16}>
                        <Col span={6}>
                          <Statistic title="Views" value={5} />
                        </Col>
                        <Col span={7}>
                          <Statistic title="Time Spent" value="10 min" />
                        </Col>
                        <Col span={11}>
                          <div className={styles.statHeading}>Rating</div>
                          <Rate disabled defaultValue={2} />
                        </Col>
                      </Row>
                      <Row>
                        <Col san={24}>
                          <div className={styles.candidateFeedback}>
                            {' '}
                            I like this guy. He shows a lot of charisma and character and hutzpa.
                            Highly reccomended.{' '}
                          </div>
                        </Col>
                      </Row>
                    </Card>
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
