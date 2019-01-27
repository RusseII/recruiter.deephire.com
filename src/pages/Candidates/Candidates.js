import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import { showConfirm } from '@/utils/utils';
import ShareCandidateButton from '@/components/ShareCandidateButton';

import styles from './Candidates.less';

const readableTime = require('readable-timestamp');

@connect(({ rule, loading, user }) => ({
  currentUser: user.currentUser,
  rule,
  loading: loading.models.rule,
}))
class Candidates extends PureComponent {
  state = {
    selectedRows: [],
  };

  columns = [
    {
      title: 'Interview Name',
      dataIndex: 'interview_name',
    },
    {
      title: 'Name',
      dataIndex: 'user_name',
    },
    {
      title: 'Email',
      dataIndex: 'candidate_email',
    },
    {
      title: 'Time',
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
      title: 'View',
      render: (text, data) => (
        <Fragment>
          <a onClick={() => this.openInterview(data)}>View</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const { email } = profile;
    const { dispatch } = this.props;

    if (email) {
      dispatch({
        type: 'rule/fetch',
        payload: email,
      });
    }
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  openInterview = data => {
    const { company_id: companyId, user_id: userId } = data;
    router.push(`/candidates/view-candidate/?id=${companyId}&candidate=${userId}`);
  };

  render() {
    const {
      rule: { data },
      dispatch,
      loading,
    } = this.props;

    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="Candidates">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <ShareCandidateButton candidateData={selectedRows} />

                  <Button
                    type="danger"
                    onClick={() => {
                      showConfirm(dispatch, selectedRows, 'rule/removeCandidate', () =>
                        this.setState({ selectedRows: [] })
                      );
                    }}
                  >
                    Delete
                  </Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Candidates;
