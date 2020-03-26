import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';

const Upgrade = props => {
  const { text = 'Upgrade' } = props;
  return (
    <Button type="primary" onClick={() => router.push('/billing/plans')} {...props}>
      {text}
    </Button>
  );
};

export default Upgrade;
