import React, { PureComponent } from 'react';
import { Card, List, AutoComplete, Checkbox, Row, Col } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import { showConfirm } from '@/utils/utils';
import ShareCandidateButton from '@/components/ShareCandidateButton';
import CandidateCard from '@/components/CandidateCard';
import { getVideos } from '@/services/api';

import styles from './Candidates.less';

class Candidates extends PureComponent {
  state = {
    selectedCards: [],
  };

  componentDidMount() {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const { email } = profile;

    getVideos(email).then(data => this.setState({ data }));
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

  render() {
    const { searchTerm, data } = this.state;

    if (!data) return null;
    let filteredData = [];

    if (searchTerm == null) {
      filteredData = data;
    } else {
      filteredData = data.filter(
        candidate =>
          candidate.candidateEmail === searchTerm ||
          candidate.interviewName === searchTerm ||
          candidate.userName === searchTerm
      );
    }

    const searchDataSource = [];
    data.forEach(candidate => {
      if (candidate.userName != null) searchDataSource.push(candidate.userName);
      if (candidate.candidateEmail != null) searchDataSource.push(candidate.candidateEmail);
      if (candidate.interviewName != null) searchDataSource.push(candidate.interviewName);
    });

    const unique = [...new Set(searchDataSource)];

    const { loading } = this.props;

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
                  <CandidateCard item={item} />
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
