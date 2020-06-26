import React from 'react';
import { Row, Divider, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const TableToolbar = props => {
  const { reload, selectedInfo, extra } = props;

  return (
    <Row style={{ marginTop: -8, marginBottom: 16 }} justify="space-between" {...props}>
      <span style={{ marginTop: 8 }}>
        {selectedInfo ? `Selected ${selectedInfo.count} ${selectedInfo.type}` : null}
      </span>

      <span>
        {extra}
        <>
          <Divider type="vertical" />
          <Tooltip title="Reload">
            <ReloadOutlined
              style={{ fontSize: 16, marginTop: 8, marginLeft: 8 }}
              onClick={reload}
            />
          </Tooltip>
        </>
      </span>
    </Row>
  );
};

export default TableToolbar;
