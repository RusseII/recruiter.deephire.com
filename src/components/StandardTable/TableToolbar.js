import React from 'react';
import { Row, Divider, Tooltip, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const TableToolbar = props => {
  const { reload, selectedInfo, extra } = props;

  return (
    <Row style={{ marginTop: -8, marginBottom: 16 }} justify="space-between" {...props}>
      <span style={{ marginTop: 8 }}>
        {selectedInfo ? `Selected ${selectedInfo.count} ${selectedInfo.type}` : null}
      </span>

      <Row align="middle">
        {extra}
        <Space>
          <Divider type="vertical" />
          <Tooltip title="Reload">
            <ReloadOutlined style={{ fontSize: 16 }} onClick={reload} />
          </Tooltip>
        </Space>
      </Row>
    </Row>
  );
};

export default TableToolbar;
