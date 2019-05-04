import React from 'react';

import { Button } from 'antd';
import { arch } from '@/services/api';

const Archive = ({ setSelectedCards, archiveData, route, archives, reload }) => {
  const shouldArch = () => {
    const data = archiveData.map(data => data._id);
    arch(data, route, archives).then(reload());
    setSelectedCards([]);
  };
  return <Button onClick={shouldArch}>{archives ? 'Unarchive' : 'Archive'}</Button>;
};

export default Archive;
