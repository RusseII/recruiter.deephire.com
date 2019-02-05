import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, List } from 'antd';
import qs from 'qs';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ShortListCandidateCard from '@/components/ShortListCandidateCard';

import { getTimeDistance } from '@/utils/utils';
import { getShortListData } from '@/services/api';

import styles from './ShortListAnalytics.less';
import ShortListStatsCard from '@/components/ShortListStatsCard';

const ProportionSales = React.lazy(() => import('./ProportionSales'));

const readableTime = require('readable-timestamp');

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class ShortListAnalytics extends Component {
  state = {
    rangePickerValue: getTimeDistance('year'),
  };

  componentDidMount() {
    const { location } = this.props;
    const id = qs.parse(location.search)['?id'];

    getShortListData(id).then(r => this.setState({ analyticsData: r }));
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

  friendlyDate = rawDate => {
    const dateObj = new Date(rawDate);
    const displayTime = readableTime(dateObj);
    return displayTime;
  };

  render() {
    const { analyticsData: temp, candidateStatus } = this.state;
    if (!temp) {
      return null;
    }
    const analyticsData = temp[0];

    const { loading } = this.props;

    let lastViewed = 'Not Seen';
    if (analyticsData.clicks) {
      lastViewed = this.friendlyDate(analyticsData.clicks[0]);
    }

    const { shortUrl, interviews } = analyticsData;

    const totalCandidates = interviews.length;

    let views = 0;
    interviews.forEach(candidate => {
      if (candidate.clicks) {
        views += candidate.clicks.length;
      }
    });

    let reviewedCandidates = 0;
    let notReviewedCandidates = 0;
    let notSeenCandidates = 0;

    let acceptedCandidates = 0;
    let maybeCandidates = 0;
    let declinedCandidates = 0;

    interviews.forEach(candidate => {
      if (candidate.interview) reviewedCandidates += 1;
      else if (candidate.clicks) notReviewedCandidates += 1;
      else notSeenCandidates += 1;
    });

    interviews.forEach(candidate => {
      if (candidate.interview === 'yes') acceptedCandidates += 1;
      else if (candidate.interview === 'maybe') maybeCandidates += 1;
      else if (candidate.interview === 'no') declinedCandidates += 1;
    });

    const overviewCandidateStatus = [
      { x: 'Accepted', y: acceptedCandidates },
      { x: 'Not Seen', y: notSeenCandidates },
    ];

    const reviewedCandidateStatus = [
      { x: 'Accepted', y: acceptedCandidates },
      { x: 'Unsure', y: maybeCandidates },
      { x: 'Declined', y: declinedCandidates },
    ];

    const unReviewedCandidates = [
      { x: 'Reviewed', y: reviewedCandidates },
      { x: 'Not Reviewed', y: notReviewedCandidates },
      { x: 'Not Seen', y: notSeenCandidates },
    ];

    let salesPieData;
    if (candidateStatus === 'overview') {
      salesPieData = overviewCandidateStatus;
    } else {
      salesPieData =
        candidateStatus === 'reviewed' ? reviewedCandidateStatus : unReviewedCandidates;
    }

    return (
      <GridContent>
        <PageHeaderWrapper title={`Short List - ${analyticsData.email}`} shortUrl={shortUrl}>
          {/* <Card className={styles.shortListStatsCard}> */}
          {/* <div className={styles.shortListTitle}>Short List Statistics</div> */}
          <Row gutter={16}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSales
                  title="Candidate Status"
                  candidateStatus={candidateStatus}
                  loading={loading}
                  salesPieData={salesPieData}
                  handleChangeSalesType={this.handleChangeCandidateStatusPie}
                />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <ShortListStatsCard
                views={views}
                lastViewed={lastViewed}
                acceptedCandidates={acceptedCandidates}
                totalCandidates={totalCandidates}
              />
            </Col>
          </Row>
          {/* </Card> */}

          {/* <Card className={styles.candidatesTitleCard}>
            <div className={styles.candidatesTitle}>Candidates</div>
          </Card> */}
          <div className={styles.cardList}>
            <List
              rowKey="id"
              style={{ marginTop: 24 }}
              grid={{ gutter: 24, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}
              loading={loading}
              dataSource={interviews}
              renderItem={item => (
                <List.Item key={item.id}>
                  <ShortListCandidateCard item={item} />
                </List.Item>
              )}
            />
          </div>
        </PageHeaderWrapper>
      </GridContent>
    );
  }
}

export default ShortListAnalytics;
