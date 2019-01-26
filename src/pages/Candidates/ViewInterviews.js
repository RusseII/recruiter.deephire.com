import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import readableTime from 'readable-timestamp';
import styles from './Candidates.less';
import { showConfirm } from '@/utils/utils';

const openInterview = data => {
  const { short_url: shortUrl } = data;
  window.open(shortUrl, '_blank');
};

const columns = [
  {
    title: 'Interview Name',
    dataIndex: 'interviewName',
  },
  {
    title: 'Interview Questions',
    render(x, data) {
      try {
        const listItems = data.interview_questions.map(d => (
          <div>
            <li key={d.question}>{d.question}</li>
            <br />
          </div>
        ));
        return <div>{listItems} </div>;
      } catch {
        return null;
      }
    },
  },

  {
    title: 'Created',
    sorter: true,
    render(test, data) {
      try {
        const dateObj = new Date(data.python_datetime);
        const displayTime = readableTime(dateObj);
        return <div>{displayTime}</div>;
      } catch {
        return null;
      }
    },
  },
  {
    title: 'Interview Link',
    render: (text, data) => (
      <Fragment>
        <a onClick={() => openInterview(data)}>{data.short_url}</a>
      </Fragment>
    ),
  },
];

@connect(({ rule, loading, user }) => ({
  currentUser: user.currentUser,
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    selectedRows: [],
  };

  componentDidMount() {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const { email } = profile;
    const { dispatch } = this.props;

    if (email) {
      dispatch({
        type: 'rule/view_interviews',
        payload: email,
      });
    }
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  render() {
    const {
      rule: { data },
      loading,
      dispatch,
    } = this.props;

    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="Interviews">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {selectedRows.length > 0 && (
              <span>
                <Button
                  type="danger"
                  onClick={() => {
                    showConfirm(dispatch, selectedRows, 'rule/removeInterview', () =>
                      this.setState({ selectedRows: [] })
                    );
                  }}
                >
                  Delete
                </Button>
                <br />
                <br />
              </span>
            )}

            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
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

export default TableList;
