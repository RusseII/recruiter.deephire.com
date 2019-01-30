import React from 'react';

import { Card, Checkbox, Icon } from 'antd';
import router from 'umi/router';
import styles from './index.less';

const readableTime = require('readable-timestamp');

const openInterview = item => {
  const { company_id: companyId, user_id: userId } = item;
  router.push(`/candidates/view-candidate/?id=${companyId}&candidate=${userId}`);
};
const friendlyDate = rawDate => {
  const dateObj = new Date(rawDate);
  const displayTime = readableTime(dateObj);
  return displayTime;
};

const CardInfo = ({ item }) => (
  <div className={styles.cardInfo}>
    <p>{item.candidate_email || '-'}</p>
    <p className={styles.body}>{item.interview_name || '-'}</p>
    <p className={styles.body}>{friendlyDate(item.python_datetime) || '-'}</p>
  </div>
);

const CandidateCard = ({ item }) => (
  <Card
    bodyStyle={{ paddingBottom: 20 }}
    actions={[<Checkbox value={item} />, <a onClick={() => openInterview(item)}>View</a>]}
  >
    <Card.Meta avatar={<Icon type="user" />} title={item.user_name} />
    <div className={styles.cardItemContent}>
      <CardInfo item={item} />
    </div>
  </Card>
);

export default CandidateCard;
