import React from 'react';

import { message, Button } from 'antd';
import { arch } from '@/services/api';

const Archive = ({ onClick, archiveData, route, archives, reload, active = true }) => {
  const shouldArch = async () => {
    const data = archiveData.map(data => data._id);
    await arch(data, route, archives);
    await reload();
    onClick();
    message.success(archives ? 'Succesfully unarchived' : 'Successfully archived');
  };
  return (
    <Button disabled={!active} style={{ marginRight: '16px' }} onClick={shouldArch}>
      {archives ? 'Unarchive' : 'Archive'}
    </Button>
  );
};

export default Archive;
