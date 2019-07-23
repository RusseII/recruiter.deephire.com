import { Avatar, Card, Checkbox } from 'antd';
import React from 'react';
import router from 'umi/router';
import styles from './index.less';

const readableTime = require('readable-timestamp');

const openInterview = item => {
  const { _id } = item;
  router.push(`/candidates/view-candidate/?id=${_id}`);
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
    <p className={styles.body}>{friendlyDate(item.timestamp) || '-'}</p>
  </div>
);

const CandidateCard = ({ item }) => (
  <Card
    hoverable
    bodyStyle={{ paddingBottom: 20 }}
    actions={[
      <Checkbox style={{ paddingLeft: 50, paddingRight: 50 }} value={item} />,
      <a style={{ paddingLeft: 50, paddingRight: 50 }} onClick={() => openInterview(item)}>
        View
      </a>,
    ]}
  >
    <Card.Meta
      avatar={
        <Avatar shape="circle" size="large" icon="user" src={item.responses[0].thumbnail100x100} />
      }
      title={item.userName}
    />
    <div className={styles.cardItemContent}>
      <CardInfo item={item} />
    </div>
  </Card>
);

export default CandidateCard;
