import React from 'react';
import { PageHeader } from 'antd';
import router from 'umi/router';

const AntPageHeader = props => (
  <PageHeader
    style={{
      width: 'calc(100% + 48px)',
      marginTop: -24,
      marginBottom: 24,
      marginLeft: -24,
    }}
    onBack={() => router.goBack()}
    ghost={false}
    {...props}
  />
);

export default AntPageHeader;
