import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, List, AutoComplete, Icon, Checkbox, Row, Col } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import { showConfirm } from '@/utils/utils';
import ShareCandidateButton from '@/components/ShareCandidateButton';

import styles from './Candidates.less';

const readableTime = require('readable-timestamp');

// const mockData = {
//   list: [
//     {
//       _id: {
//         $oid: '5c4ca732f2b3768b9ecb4fad',
//       },
//       candidate_email: 'russell@deephire.com',
//       interview_name: 'no_name',
//       python_datetime: '2018-11-09 16:22:37',
//       user_id: 'google-oauth2|108316160914067599948',
//       user_name: 'Russell Ratcliffe',
//       responses: [
//         {
//           question_text: 'What are three words that describe youtself? And Why?',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//         {
//           question_text: 'question 2 hahah',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//       ],
//     },
//     {
//       _id: {
//         $oid: 'otherid',
//       },
//       candidate_email: 'emerson@deephire.com',
//       interview_name: 'I love interviews2',
//       python_datetime: '2018-11-09 16:22:37',
//       user_id: 'google-oauth2|108316160914067599948',
//       user_name: 'Emerson Clouder',
//       responses: [
//         {
//           question_text: 'What are three words that describe youtself? And Why?',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//         {
//           question_text: 'question 2 hahah',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//       ],
//     },
//     {
//       _id: {
//         $oid: 'otherid',
//       },
//       candidate_email: 'emerson@deephire.com',
//       interview_name: 'I love interviews2',
//       python_datetime: '2018-11-09 16:22:37',
//       user_id: 'google-oauth2|108316160914067599948',
//       user_name: 'Emerson Clouder',
//       responses: [
//         {
//           question_text: 'What are three words that describe youtself? And Why?',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//         {
//           question_text: 'question 2 hahah',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//       ],
//     },
//     {
//       _id: {
//         $oid: 'otherid',
//       },
//       candidate_email: 'emerson@deephire.com',
//       interview_name: 'I love interviews2',
//       python_datetime: '2018-11-09 16:22:37',
//       user_id: 'google-oauth2|108316160914067599948',
//       user_name: 'Emerson Clouder',
//       responses: [
//         {
//           question_text: 'What are three words that describe youtself? And Why?',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//         {
//           question_text: 'question 2 hahah',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//       ],
//     },
//     {
//       _id: {
//         $oid: 'otherid',
//       },
//       candidate_email: 'emerson@deephire.com',
//       interview_name: 'I love interviews2',
//       python_datetime: '2018-11-09 16:22:37',
//       user_id: 'google-oauth2|108316160914067599948',
//       user_name: 'Emerson Clouder',
//       responses: [
//         {
//           question_text: 'What are three words that describe youtself? And Why?',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//         {
//           question_text: 'question 2 hahah',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//       ],
//     },
//     {
//       _id: {
//         $oid: 'otherid',
//       },
//       candidate_email: 'emerson@deephire.com',
//       interview_name: 'I love interviews2',
//       python_datetime: '2018-11-09 16:22:37',
//       user_id: 'google-oauth2|108316160914067599948',
//       user_name: 'Emerson Clouder',
//       responses: [
//         {
//           question_text: 'What are three words that describe youtself? And Why?',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//         {
//           question_text: 'question 2 hahah',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//       ],
//     },
//     {
//       _id: {
//         $oid: 'otherid',
//       },
//       candidate_email: 'emerson@deephire.com',
//       interview_name: 'I love interviews2',
//       python_datetime: '2018-11-09 16:22:37',
//       user_id: 'google-oauth2|108316160914067599948',
//       user_name: 'Emerson Clouder',
//       responses: [
//         {
//           question_text: 'What are three words that describe youtself? And Why?',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//         {
//           question_text: 'question 2 hahah',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//       ],
//     },
//     {
//       _id: {
//         $oid: 'otherid',
//       },
//       candidate_email: 'emerson@deephire.com',
//       interview_name: 'I love interviews2',
//       python_datetime: '2018-11-09 16:22:37',
//       user_id: 'google-oauth2|108316160914067599948',
//       user_name: 'Emerson Clouder',
//       responses: [
//         {
//           question_text: 'What are three words that describe youtself? And Why?',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//         {
//           question_text: 'question 2 hahah',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//       ],
//     },
//     {
//       _id: {
//         $oid: 'otherid',
//       },
//       candidate_email: 'emerson@deephire.com',
//       interview_name: 'I love interviews2',
//       python_datetime: '2018-11-09 16:22:37',
//       user_id: 'google-oauth2|108316160914067599948',
//       user_name: 'Emerson Clouder',
//       responses: [
//         {
//           question_text: 'What are three words that describe youtself? And Why?',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//         {
//           question_text: 'question 2 hahah',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//       ],
//     },
//     {
//       _id: {
//         $oid: 'otherid',
//       },
//       candidate_email: 'emerson@deephire.com',
//       interview_name: 'I love interviews2',
//       python_datetime: '2018-11-09 16:22:37',
//       user_id: 'google-oauth2|108316160914067599948',
//       user_name: 'Emerson Clouder',
//       responses: [
//         {
//           question_text: 'What are three words that describe youtself? And Why?',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//         {
//           question_text: 'question 2 hahah',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//       ],
//     },
//     {
//       _id: {
//         $oid: 'otherid',
//       },
//       candidate_email: 'emerson@deephire.com',
//       interview_name: 'I love interviews2',
//       python_datetime: '2018-11-09 16:22:37',
//       user_id: 'google-oauth2|108316160914067599948',
//       user_name: 'Emerson Clouder',
//       responses: [
//         {
//           question_text: 'What are three words that describe youtself? And Why?',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//         {
//           question_text: 'question 2 hahah',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//       ],
//     },
//     {
//       _id: {
//         $oid: 'otherid',
//       },
//       candidate_email: 'emerson@deephire.com',
//       interview_name: 'I love interviews2',
//       python_datetime: '2018-11-09 16:22:37',
//       user_id: 'google-oauth2|108316160914067599948',
//       user_name: 'Emerson Clouder',
//       responses: [
//         {
//           question_text: 'What are three words that describe youtself? And Why?',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//         {
//           question_text: 'question 2 hahah',
//           response_url: 'https://vimeo.com/299965218/3f595787a6',
//         },
//       ],
//     },
//   ],
// };

@connect(({ rule, loading, user }) => ({
  currentUser: user.currentUser,
  rule,
  loading: loading.models.rule,
}))
class Candidates extends PureComponent {
  state = {
    selectedCards: [],
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

  cardSelectOnChange = checkedValues => {
    this.setState({
      selectedCards: checkedValues,
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
      rule: { data },
    } = this.props;
    const { searchTerm } = this.state;

    let filteredData = [];

    if (searchTerm == null) {
      filteredData = data.list;
    } else {
      filteredData = data.list.filter(
        candidate =>
          candidate.candidate_email === searchTerm ||
          candidate.interview_name === searchTerm ||
          candidate.user_name === searchTerm
      );
    }

    const searchDataSource = [];
    data.list.forEach(candidate => {
      searchDataSource.push(candidate.user_name);
      searchDataSource.push(candidate.candidate_email);
      searchDataSource.push(candidate.interview_name);
    });

    const unique = [...new Set(searchDataSource)];

    const { dispatch, loading } = this.props;

    const CardInfo = ({ item }) => (
      <div className={styles.cardInfo}>
        <p>{item.candidate_email}</p>
        <p className={styles.body}>{item.interview_name}</p>
        <p className={styles.body}>{this.friendlyDate(item.python_datetime)}</p>
      </div>
    );

    const { selectedCards } = this.state;

    return (
      <PageHeaderWrapper title="Candidates">
        <Card>
          <div className={styles.tableListOperator}>
            <Row type="flex" justify="start" gutter={16}>
              <Col>
                <ShareCandidateButton
                  isDisabled={selectedCards.length === 0}
                  candidateData={selectedCards}
                />
              </Col>
              <Col>
                <Button
                  disabled={selectedCards.length === 0}
                  type="danger"
                  onClick={() => {
                    showConfirm(dispatch, selectedCards, 'rule/removeCandidate', () =>
                      this.setState({ selectedCards: [] })
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

        <div className={styles.filterCardList}>
          <Checkbox.Group style={{ width: '100%' }} onChange={this.cardSelectOnChange}>
            <List
              rowKey="id"
              style={{ marginTop: 24 }}
              grid={{ gutter: 24, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}
              loading={loading}
              dataSource={filteredData}
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
