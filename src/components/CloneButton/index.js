import React from 'react';

import { message, Button } from 'antd';
import { cloneInterview } from '@/services/api';

const CloneButton = props => {
  const { onClick, cloneData, reload } = props;
  const clone = async () => {
    const data = cloneData.map(data => data._id);
    await cloneInterview(data);
    await reload();
    onClick();
    message.success('Clone Successful');
  };
  return (
    <Button {...props} onClick={clone}>
      Clone
    </Button>
  );
};

export default CloneButton;
