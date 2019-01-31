import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Tooltip, Row, Col, AutoComplete } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import readableTime from 'readable-timestamp';
import styles from './ShortLists.less';
import { showConfirm } from '@/utils/utils';

import { getShortlists } from '@/services/api';

const columns = [
  {
    title: 'Shared With',
    render: data => {
      const { name, email } = data;
      return (
        <div>
          <div>{name}</div>
          <div>{email}</div>
        </div>
      );
    },
  },
  {
    title: 'Last Viewed',
    render: data => {
      const { clicks } = data;

      const clickCount = clicks ? clicks.length : 0;
      const dateObj = new Date(clicks[clickCount - 1]);
      const displayTime = readableTime(dateObj);

      return (
        <Fragment>
          <div>{displayTime || '-'}</div>
        </Fragment>
      );
    },
  },
  {
    title: 'View Count',
    render: data => {
      const { clicks } = data;

      const clickCount = clicks ? clicks.length : 0;

      return (
        <Fragment>
          <div className={styles.clickCount}>{clickCount || '-'}</div>
        </Fragment>
      );
    },
  },
  {
    title: 'Link',
    render: data => {
      const { link } = data;

      return (
        <Tooltip title="Click to copy">
          <a>{link || '-'}</a>
        </Tooltip>
      );
    },
  },
];

@connect(({ rule, loading, user }) => ({
  currentUser: user.currentUser,
  rule,
  loading: loading.models.rule,
}))
class ShortLists extends PureComponent {
  state = {
    selectedRows: [],
  };

  componentDidMount() {
    getShortlists().then(r => this.setState({ data: r }));
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  autoCompleteSelect = value => {
    if (value === '') {
      this.setState({
        searchTerm: null,
      });
    } else {
      this.setState({
        searchTerm: value,
      });
    }
  };

  autoCompleteSearch = value => {
    if (value === '') {
      this.setState({
        searchTerm: null,
      });
    }
  };

  render() {
    const { data, searchTerm } = this.state;
    const { loading, dispatch } = this.props;

    if (!data) return null;

    let filteredList = [];
    if (searchTerm == null) {
      filteredList = data.list;
    } else {
      filteredList = data.list.filter(shortList => shortList.email === searchTerm);
    }

    const searchDataSource = [];
    data.list.forEach(shortList => {
      if (shortList.email != null) searchDataSource.push(shortList.email);
    });
    const unique = [...new Set(searchDataSource)];

    const filteredData = {
      list: filteredList,
    };

    const { selectedRows } = this.state;

    filteredList.forEach((listItem, listIndex) => {
      selectedRows.forEach(rowItem => {
        if (listItem !== rowItem) {
          selectedRows.splice(listIndex, 1);
        }
      });
    });

    return (
      <PageHeaderWrapper title="Short Lists">
        <Card>
          <div className={styles.tableListOperator}>
            <Row type="flex" justify="start" gutter={16}>
              <Col>
                <Button
                  disabled={selectedRows.length === 0}
                  type="danger"
                  onClick={() => {
                    showConfirm(dispatch, selectedRows, 'rule/removeInterview', () =>
                      this.setState({ selectedRows: [] })
                    );
                  }}
                >
                  Delete
                </Button>
              </Col>
              <Col>
                <AutoComplete
                  allowClear
                  dataSource={unique}
                  style={{ width: 200 }}
                  onSelect={this.autoCompleteSelect}
                  onSearch={this.autoCompleteSearch}
                  filterOption={(inputValue, option) =>
                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  placeholder="Search"
                />
              </Col>
            </Row>
          </div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={filteredData}
              size="small"
              columns={columns}
              onSelectRow={this.handleSelectRows}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ShortLists;
