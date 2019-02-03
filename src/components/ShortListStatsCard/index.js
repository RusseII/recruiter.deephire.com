import React from 'react';

import { Card, Row, Col, Divider } from 'antd';
import styles from './index.less';

const ShortListStatsCard = ({ views, lastViewed, acceptedCandidates, totalCandidates }) => (
  <Card className={styles.shortListStatsCardStats}>
    <Row type="flex" justify="start" gutter={16}>
      <Col>
        <div className={styles.shortListStats}>Views:</div>
      </Col>
      <Col>
        <div className={styles.shortListStatsValue}>{views}</div>
      </Col>
    </Row>
    <Divider />
    <Row type="flex" justify="start" gutter={16}>
      <Col>
        <div className={styles.shortListStats}>Last Viewed:</div>
      </Col>
      <Col>
        <div className={styles.shortListStatsValue}>{lastViewed}</div>
      </Col>
    </Row>
    <Divider />
    <Row type="flex" justify="start" gutter={16}>
      <Col>
        <div className={styles.shortListStats}>Passed:</div>
      </Col>
      <Col>
        <div className={styles.shortListStatsValue}>
          {acceptedCandidates}/{totalCandidates} Candidates
        </div>
      </Col>
    </Row>
  </Card>
);

export default ShortListStatsCard;
