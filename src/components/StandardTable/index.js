import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns, selectedRows } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: selectedRows,
      needTotalList,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows && nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { selectedRowKeys, needTotalList, width } = this.state;
    const {
      data: { list, pagination },
      loading,
      columns,
      rowKey,
      selectedRows,
    } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <Table
          scroll={{ x: true }}
          loading={loading}
          rowKey={rowKey || '_id'}
          rowSelection={selectedRows ? rowSelection : null}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...this.props}
        />
      </div>
    );
  }
}

export default StandardTable;
