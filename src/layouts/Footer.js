import React, { Fragment } from 'react';
import { Layout } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter copyright={<Fragment>Powered by DeepHire | Find your fit.</Fragment>} />
  </Footer>
);
export default FooterView;
