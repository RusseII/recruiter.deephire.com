import React from 'react';

import { Card, Row, Col, Divider } from 'antd';
import styles from './index.less';

const ShortListStatsCard = ({ views }) => (
  <Card className={styles.shortListStatsCardStats}>
    <Row type="flex" justify="start" gutter={16}>
      <Col>
        <div className={styles.shortListStats}>Views: </div>
      </Col>
      <Col>
        <div className={styles.shortListStatsValue}>{views}</div>
      </Col>
    </Row>
    <Divider />
    <Row type="flex" justify="start" gutter={16}>
      <Col>
        <div className={styles.shortListStats}>Time Spent: </div>
      </Col>
      <Col>
        <div className={styles.shortListStatsValue}>20 minutes</div>
      </Col>
    </Row>
    <Divider />
    <Row type="flex" justify="start" gutter={16}>
      <Col>
        <div className={styles.shortListStats}>Passed: </div>
      </Col>
      <Col>
        <div className={styles.shortListStatsValue}>3/5 Candidates</div>
      </Col>
    </Row>
  </Card>
);

export default ShortListStatsCard;
