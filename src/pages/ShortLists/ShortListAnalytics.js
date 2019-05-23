import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, List, Skeleton } from 'antd';
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

@connect(({ chart, loading }) => {
  return {
    chart,
    loading: loading.effects['chart/fetch'],
  };
})
class ShortListAnalytics extends Component {
  state = {
    analyticsData: { clicks: [], email: '', interviews: [], shortUrl: '', temp: {} },
    rangePickerValue: getTimeDistance('year'),
    candidateStatus: 'overview',
    skeletonLoading: true,
  };

  componentDidMount() {
    const { location } = this.props;
    const id = qs.parse(location.search)['?id'];

    getShortListData(id).then(r => {
      this.setState({
        analyticsData: r,
        skeletonLoading: false,
      });
    });
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
    const { skeletonLoading } = this.state;
    const { loading } = this.props;
    const { analyticsData: temp, candidateStatus } = this.state;

    const analyticsData = temp[0];

    // Renders skeletons if analyticsData is undefined
    if (!analyticsData) {
      return (
        <GridContent>
          <PageHeaderWrapper>
            <Row gutter={16}>
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <Suspense fallback={null}>
                  <Skeleton loading={skeletonLoading} active avatar />
                </Suspense>
              </Col>
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <Skeleton loading={skeletonLoading} active />
              </Col>
            </Row>
            <Skeleton loading={skeletonLoading} active>
              <div className={styles.cardList}>
                <List
                  rowKey="id"
                  style={{ marginTop: 24 }}
                  loading={loading}
                  grid={{ gutter: 24, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <ShortListCandidateCard item={item} />
                    </List.Item>
                  )}
                />
              </div>
            </Skeleton>
          </PageHeaderWrapper>
        </GridContent>
      );
    }

    // Renders everything by default if analyticsData is defined
    const { email, clicks, interviews, shortUrl } = analyticsData;

    let lastViewed = 'Not Seen';

    if (clicks) {
      const length = clicks.length - 1;
      lastViewed = this.friendlyDate(clicks[length]);
    }

    const totalCandidates = interviews ? interviews.length : 0;
    const views = clicks ? clicks.length : 0;

    let reviewedCandidates = 0;
    let notReviewedCandidates = 0;
    let notSeenCandidates = 0;

    let acceptedCandidates = 0;
    let maybeCandidates = 0;
    let declinedCandidates = 0;

    analyticsData.interviews.forEach(candidate => {
      if (candidate.interest || candidate.rating) reviewedCandidates += 1;
      else if (candidate.clicks) notReviewedCandidates += 1;
      else notSeenCandidates += 1;
    });
    analyticsData.interviews.forEach(candidate => {
      if (candidate.interest ? candidate.interest === 1 : candidate.rating > 3)
        acceptedCandidates += 1;
      else if (
        candidate.interest ? candidate.interest === 2 : candidate.rating < 4 && candidate.rating > 1
      )
        maybeCandidates += 1;
      else if (
        candidate.interest
          ? candidate.interest === 3
          : candidate.rating < 2 && candidate.rating > -1
      )
        declinedCandidates += 1;
    });

    const overviewCandidateStatus = [
      { x: 'Accepted', y: acceptedCandidates },
      { x: 'Undecided', y: maybeCandidates },
      { x: 'Declined', y: declinedCandidates },
      { x: 'Not Reviewed', y: notReviewedCandidates },
      { x: 'Not Seen', y: notSeenCandidates },
    ];

    const reviewedCandidateStatus = [
      { x: 'Accepted', y: acceptedCandidates },
      { x: 'Undecided', y: maybeCandidates },
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
        <PageHeaderWrapper title={`Short List - ${email}`} shortUrl={shortUrl}>
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
          <div className={styles.cardList}>
            <List
              rowKey="id"
              style={{ marginTop: 24 }}
              loading={loading}
              grid={{ gutter: 24, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}
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
