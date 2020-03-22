import React from 'react';

import { message, Button } from 'antd';
import { cloneInterview } from '@/services/api';

const CloneButton = ({ onClick, cloneData, reload }) => {
  const clone = async () => {
    const data = cloneData.map(data => data._id);
    await cloneInterview(data);
    await reload();
    onClick();
    message.success('Clone Successful');
  };
  return (
    <Button style={{ marginRight: 16 }} onClick={clone}>
      Clone
    </Button>
  );
};

export default CloneButton;
