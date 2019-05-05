import { arch } from '@/services/api';
import { Button, message } from 'antd';
import React, { FC } from 'react';

type ArchiveProps = {
  onClick: () => void;
  archiveData: { _id: string }[];
  route: string;
  archives: boolean;
  reload: () => void;
};

const Archive: FC<ArchiveProps> = ({ onClick, archiveData, route, archives, reload }) => {
  const shouldArch = async () => {
    const data = archiveData.map(data => data._id);
    await arch(data, route, archives);
    await reload();
    onClick();
    message.success(archives ? 'Succesfully unarchived' : 'Successfully archived');
  };
  return (
    <Button style={{ marginRight: '16px' }} onClick={shouldArch}>
      {archives ? 'Unarchive' : 'Archive'}
    </Button>
  );
};

export default Archive;
