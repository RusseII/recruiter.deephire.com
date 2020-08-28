import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Checkbox } from 'antd';
import React from 'react';
import router from 'umi/router';
import Link from 'umi/link';
import styles from './index.less';

const readableTime = require('readable-timestamp');

const openInterview = item => {
  const { _id } = item;
  router.push(`/one-way/candidates/candidate/?id=${_id}`);
};

const friendlyDate = rawDate => {
  const dateObj = new Date(rawDate);
  const displayTime = readableTime(dateObj);
  return displayTime;
};

const CardInfo = ({ item }) => (
  <div className={styles.cardInfo}>
    <p className={styles.email}>{item.candidateEmail || '-'}</p>
    <p className={styles.body}>{item.interviewName || '-'}</p>
    <span className={styles.body}>{friendlyDate(item.timestamp) || '-'}</span>
  </div>
);

const CandidateCard = ({ item }) => (
  <Card
    hoverable
    onClick={() => openInterview(item)}
    actions={[
      <div style={{ margin: '-12px 0px', padding: '12px 0px' }} onClick={e => e.stopPropagation()}>
        <Checkbox style={{ width: '100%', height: '100%' }} value={item} />
      </div>,
      <Link
        to={`/one-way/candidates/candidate/?id=${item._id}`}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', height: '100%' }}
      >
        View
      </Link>,
    ]}
  >
    <Card.Meta
      avatar={
        <Avatar
          shape="circle"
          size="large"
          icon={<UserOutlined />}
          key={item.responses[0] ? item.responses[0].thumbnail100x100 : null}
          src={item.responses[0] ? item.responses[0].thumbnail100x100 : null}
        />
      }
      title={item.userName}
    />
    <div className={styles.cardItemContent}>
      <CardInfo item={item} />
    </div>
  </Card>
);

export default CandidateCard;
