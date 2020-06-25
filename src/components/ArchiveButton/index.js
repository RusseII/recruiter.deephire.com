import React from 'react';

import { message, Button } from 'antd';
import { arch } from '@/services/api';

const Archive = props => {
  const { onClick, archiveData, route, archives, reload, active = true } = props;
  const shouldArch = async () => {
    const data = archiveData.map(data => data._id);
    await arch(data, route, archives);
    // TODO - without this random wait, the old data is requested before the update.
    // Figure out why the call to reload does not get the most recent data
    await new Promise(resolve => setTimeout(resolve, 300));
    await reload();
    onClick();
    message.success(archives ? 'Succesfully unhidden' : 'Successfully hidden');
  };
  return (
    <Button disabled={!active} {...props} onClick={shouldArch}>
      {archives ? 'Unhide' : 'Hide'}
    </Button>
  );
};

export default Archive;
