import React from 'react';

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

import { Card, Row, Col, Statistic, Rate, Tooltip } from 'antd';
import styles from './index.less';

const ShortListAnalyticsCard = ({ item }) => (
  <Card
    id={item.id}
    className={styles.candidateAnalyticsCard}
    subTitle={item.candidateEmail}
    bordered={false}
    style={{ backgroundColor: '#fff' }}
  >
    <Row type="flex" justify="start" gutter={24}>
      <Col>
        <div className={styles.title}>{item.userName}</div>
      </Col>
      <Col>
        {/* Yes */}
        {(item.interest ? item.interest === 1 : item.rating > 3) && (
          <Tooltip title="Client wants to interview this candidate">
            <CheckCircleOutlined style={{ fontSize: '24px', color: '#54ed1c', marginTop: 5 }} />
          </Tooltip>
        )}
        {/* maybe */}
        {(item.interest ? item.interest === 2 : item.rating < 4 && item.rating > 1) && (
          <Tooltip title="Client unsure about candidate">
            <QuestionCircleOutlined style={{ fontSize: '24px', color: '#e8e819', marginTop: 5 }} />
          </Tooltip>
        )}
        {/* no */}
        {(item.interest ? item.interest === 3 : item.rating < 2 && item.rating > 0) && (
          <Tooltip title="Client does not want to interview">
            <CloseCircleOutlined style={{ fontSize: '24px', color: '#f04764', marginTop: 5 }} />
          </Tooltip>
        )}
        {!item.interest && !item.rating && (
          <Tooltip title="Client has not yet reviewed this candidate">
            <ClockCircleOutlined style={{ fontSize: '24px', color: '#808080', marginTop: 5 }} />
          </Tooltip>
        )}
      </Col>
    </Row>

    <div className={styles.subtitle}>{item.candidateEmail}</div>

    <Row type="flex" justify="start" gutter={24}>
      <Col>
        <Statistic title="Views" value={item.clicks ? item.clicks.length : ''} />
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
        <Row>
          <Col span={24}>
            <div className={styles.candidateFeedback}>{item.feedback}</div>
          </Col>
        </Row>
      )}

      {item.candidateEmail === 'russell@deephire.com' && (
        <div style={{ paddingTop: '20px' }}>
          {'Russell_Resume.pdf: '}
          <CheckCircleOutlined style={{ color: 'green' }} /> <br />
          {'Russell_Cover_Letter.pdf: '}
          <CloseCircleOutlined style={{ color: 'red' }} />
        </div>
      )}
    </div>
  </Card>
);

export default ShortListAnalyticsCard;
