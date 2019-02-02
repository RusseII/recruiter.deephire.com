import React from 'react';

import { Card, Icon, Row, Col, Statistic, Rate } from 'antd';
import styles from './index.less';

const ShortListAnalyticsCard = ({ item }) => (
  <Card
    id={item.id}
    className={styles.candidateAnalyticsCard}
    subTitle={item.candidate_email}
    bordered={false}
    style={{ backgroundColor: '#fff' }}
  >
    <Row type="flex" justify="start" gutter={24}>
      <Col>
        <div className={styles.title}>{item.user_name}</div>
      </Col>
      <Col>
        {item.interview === 'yes' && (
          <Icon type="check-circle" style={{ fontSize: '24px', color: '#08c', marginTop: 5 }} />
        )}
        {item.interview === 'maybe' && (
          <Icon
            type="question-circle"
            style={{ fontSize: '24px', color: '#e8e247', marginTop: 5 }}
          />
        )}
        {item.interview === 'no' && (
          <Icon type="close-circle" style={{ fontSize: '24px', color: '#d33d3d', marginTop: 5 }} />
        )}
        {!item.interview && (
          <Icon type="clock-circle" style={{ fontSize: '24px', color: '#b2b2b2', marginTop: 5 }} />
        )}
      </Col>
    </Row>

    <div className={styles.subtitle}>{item.candidate_email}</div>

    <Row type="flex" justify="start" gutter={24}>
      <Col>
        <Statistic title="Views" value={item.clicks.length} />
      </Col>
      <Col>
        <Statistic title="Time Spent" value="10 min" />
      </Col>
      <Col>
        <div className={styles.statHeading}>Rating</div>
        <Rate disabled defaultValue={item.rating} />
      </Col>
    </Row>
    <div>
      {!item.feedback ? (
        <Row>
          <Col span={24}>
            <div className={styles.candidateFeedback}>No feedback provided</div>
          </Col>
        </Row>
      ) : (
        item.feedback.map(feedback => (
          <Row>
            <Col span={24}>
              <div className={styles.candidateFeedback}>{feedback}</div>
            </Col>
          </Row>
        ))
      )}
    </div>
  </Card>
);

export default ShortListAnalyticsCard;
