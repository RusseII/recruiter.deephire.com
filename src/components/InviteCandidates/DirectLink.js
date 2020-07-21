import { Typography } from 'antd';
import React from 'react';

import { getHttpUrl } from '@bit/russeii.deephire.utils.utils';

const { Paragraph } = Typography;

const DirectLink = ({ link, message }) => (
  <>
    <div style={{ marginTop: 24 }}>{message}</div>

    <Paragraph
      style={{
        marginTop: 24,
        padding: 16,
        backgroundColor: 'white',
        fontSize: 15,
      }}
      strong
      copyable
    >
      {getHttpUrl(link)}
    </Paragraph>
  </>
);

export default DirectLink;
