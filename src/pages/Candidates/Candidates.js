import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, List, AutoComplete, Icon, Checkbox, Row, Col } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import { showConfirm } from '@/utils/utils';
import ShareCandidateButton from '@/components/ShareCandidateButton';

import styles from './Candidates.less';

const readableTime = require('readable-timestamp');

const mockData = {
  list: [
    {
      _id: {
        $oid: '5c4ca732f2b3768b9ecb4fad',
      },
      candidate_email: 'russell@deephire.com',
      interview_name: 'no_name',
      python_datetime: '2018-11-09 16:22:37',
      user_id: 'google-oauth2|108316160914067599948',
      user_name: 'Russell Ratcliffe',
      responses: [
        {
          question_text: 'What are three words that describe youtself? And Why?',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question_text: 'question 2 hahah',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
    {
      _id: {
        $oid: 'otherid',
      },
      candidate_email: 'emerson@deephire.com',
      interview_name: 'I love interviews2',
      python_datetime: '2018-11-09 16:22:37',
      user_id: 'google-oauth2|108316160914067599948',
      user_name: 'Emerson Clouder',
      responses: [
        {
          question_text: 'What are three words that describe youtself? And Why?',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question_text: 'question 2 hahah',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
    {
      _id: {
        $oid: 'otherid',
      },
      candidate_email: 'emerson@deephire.com',
      interview_name: 'I love interviews2',
      python_datetime: '2018-11-09 16:22:37',
      user_id: 'google-oauth2|108316160914067599948',
      user_name: 'Emerson Clouder',
      responses: [
        {
          question_text: 'What are three words that describe youtself? And Why?',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question_text: 'question 2 hahah',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
    {
      _id: {
        $oid: 'otherid',
      },
      candidate_email: 'emerson@deephire.com',
      interview_name: 'I love interviews2',
      python_datetime: '2018-11-09 16:22:37',
      user_id: 'google-oauth2|108316160914067599948',
      user_name: 'Emerson Clouder',
      responses: [
        {
          question_text: 'What are three words that describe youtself? And Why?',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question_text: 'question 2 hahah',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
    {
      _id: {
        $oid: 'otherid',
      },
      candidate_email: 'emerson@deephire.com',
      interview_name: 'I love interviews2',
      python_datetime: '2018-11-09 16:22:37',
      user_id: 'google-oauth2|108316160914067599948',
      user_name: 'Emerson Clouder',
      responses: [
        {
          question_text: 'What are three words that describe youtself? And Why?',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question_text: 'question 2 hahah',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
    {
      _id: {
        $oid: 'otherid',
      },
      candidate_email: 'emerson@deephire.com',
      interview_name: 'I love interviews2',
      python_datetime: '2018-11-09 16:22:37',
      user_id: 'google-oauth2|108316160914067599948',
      user_name: 'Emerson Clouder',
      responses: [
        {
          question_text: 'What are three words that describe youtself? And Why?',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question_text: 'question 2 hahah',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
    {
      _id: {
        $oid: 'otherid',
      },
      candidate_email: 'emerson@deephire.com',
      interview_name: 'I love interviews2',
      python_datetime: '2018-11-09 16:22:37',
      user_id: 'google-oauth2|108316160914067599948',
      user_name: 'Emerson Clouder',
      responses: [
        {
          question_text: 'What are three words that describe youtself? And Why?',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question_text: 'question 2 hahah',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
    {
      _id: {
        $oid: 'otherid',
      },
      candidate_email: 'emerson@deephire.com',
      interview_name: 'I love interviews2',
      python_datetime: '2018-11-09 16:22:37',
      user_id: 'google-oauth2|108316160914067599948',
      user_name: 'Emerson Clouder',
      responses: [
        {
          question_text: 'What are three words that describe youtself? And Why?',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question_text: 'question 2 hahah',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
    {
      _id: {
        $oid: 'otherid',
      },
      candidate_email: 'emerson@deephire.com',
      interview_name: 'I love interviews2',
      python_datetime: '2018-11-09 16:22:37',
      user_id: 'google-oauth2|108316160914067599948',
      user_name: 'Emerson Clouder',
      responses: [
        {
          question_text: 'What are three words that describe youtself? And Why?',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question_text: 'question 2 hahah',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
    {
      _id: {
        $oid: 'otherid',
      },
      candidate_email: 'emerson@deephire.com',
      interview_name: 'I love interviews2',
      python_datetime: '2018-11-09 16:22:37',
      user_id: 'google-oauth2|108316160914067599948',
      user_name: 'Emerson Clouder',
      responses: [
        {
          question_text: 'What are three words that describe youtself? And Why?',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question_text: 'question 2 hahah',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
    {
      _id: {
        $oid: 'otherid',
      },
      candidate_email: 'emerson@deephire.com',
      interview_name: 'I love interviews2',
      python_datetime: '2018-11-09 16:22:37',
      user_id: 'google-oauth2|108316160914067599948',
      user_name: 'Emerson Clouder',
      responses: [
        {
          question_text: 'What are three words that describe youtself? And Why?',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question_text: 'question 2 hahah',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
    {
      _id: {
        $oid: 'otherid',
      },
      candidate_email: 'emerson@deephire.com',
      interview_name: 'I love interviews2',
      python_datetime: '2018-11-09 16:22:37',
      user_id: 'google-oauth2|108316160914067599948',
      user_name: 'Emerson Clouder',
      responses: [
        {
          question_text: 'What are three words that describe youtself? And Why?',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question_text: 'question 2 hahah',
          response_url: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
  ],
};

@connect(({ rule, loading, user }) => ({
  currentUser: user.currentUser,
  rule,
  loading: loading.models.rule,
}))
class Candidates extends PureComponent {
  state = {
    selectedRows: [],
    dataSource: ['Item', 'Emerson', 'test', 'mock', 'ruseell;,'],
  };

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

  onChange = checkedValues => {
    this.setState({
      selectedRows: checkedValues,
    });
  };

  handleSearch = value => {
    this.setState({
      dataSource: !value ? [] : [value, value + value, value + value + value],
    });
  };

  openInterview = data => {
    const { company_id: companyId, user_id: userId } = data;
    router.push(`/candidates/view-candidate/?id=${companyId}&candidate=${userId}`);
  };

  friendlyDate = rawDate => {
    const dateObj = new Date(rawDate);
    const displayTime = readableTime(dateObj);
    return displayTime;
  };

  render() {
    const {
      // rule: { data },
      dispatch,
      loading,
    } = this.props;

    const { list } = mockData;

    const CardInfo = ({ item }) => (
      <div className={styles.cardInfo}>
        <p>{item.candidate_email}</p>
        <p className={styles.body}>{item.interview_name}</p>
        <p className={styles.body}>{this.friendlyDate(item.python_datetime)}</p>
      </div>
    );

    const { selectedRows, dataSource } = this.state;

    return (
      <PageHeaderWrapper title="Candidates">
        <Card>
          <div className={styles.tableListOperator}>
            <Row type="flex" justify="start" gutter={16}>
              <Col>
                <ShareCandidateButton
                  isDisabled={selectedRows.length === 0}
                  candidateData={selectedRows}
                />
              </Col>
              <Col>
                <Button
                  disabled={selectedRows.length === 0}
                  type="danger"
                  onClick={() => {
                    showConfirm(dispatch, selectedRows, 'rule/removeCandidate', () =>
                      this.setState({ selectedRows: [] })
                    );
                  }}
                >
                  Delete
                </Button>
              </Col>
              <Col>
                <AutoComplete
                  dataSource={dataSource}
                  style={{ width: 200 }}
                  // onSelect={this.onSelect}
                  onSearch={this.handleSearch}
                  placeholder="Search"
                />
              </Col>
            </Row>
          </div>
        </Card>

        <div className={styles.filterCardList}>
          <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
            <List
              rowKey="id"
              style={{ marginTop: 24 }}
              grid={{ gutter: 24, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}
              loading={loading}
              dataSource={list}
              renderItem={item => (
                <List.Item key={item.id}>
                  <Card
                    bodyStyle={{ paddingBottom: 20 }}
                    actions={[
                      <div>
                        <Checkbox value={item} />
                      </div>,
                      <a onClick={() => this.openInterview(item)}>
                        <p>View</p>
                      </a>,
                    ]}
                  >
                    <Card.Meta avatar={<Icon type="user" />} title={item.user_name} />
                    <div className={styles.cardItemContent}>
                      <CardInfo item={item} />
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Checkbox.Group>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Candidates;
