import CandidateCard from '@/components/CandidateCard';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ShareCandidateButton from '@/components/ShareCandidateButton';
import { getVideos } from '@/services/api';
import { AutoComplete, Card, Checkbox, Col, List, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './Candidates.less';

const Candidates = () => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const createDataSource = data => {
    const searchDataSource = [];
    data.forEach(candidate => {
      if (candidate.userName) searchDataSource.push(candidate.userName);
      if (candidate.candidateEmail) searchDataSource.push(candidate.candidateEmail);
      if (candidate.interviewName != null) searchDataSource.push(candidate.interviewName);
    });
    const unique = [...new Set(searchDataSource)];
    setDataSource(unique);
  };

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const { email } = profile;
    getVideos(email).then(data => {
      createDataSource(data);
      setData(data);
      setLoading(false);
      setFilteredData(data);
    });
  }, []);

  const shouldClear = value => {
    if (!value) {
      setFilteredData(data);
    }
  };

  const filter = searchTerm => {
    const filteredData = data.filter(
      candidate =>
        candidate.candidateEmail === searchTerm ||
        candidate.interviewName === searchTerm ||
        candidate.userName === searchTerm
    );
    setFilteredData(filteredData);
  };

  return (
    <PageHeaderWrapper title="Candidates">
      <Card>
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
              dataSource={dataSource}
              style={{ width: 200 }}
              onSelect={filter}
              onSearch={shouldClear}
              filterOption={(inputValue, option) =>
                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              placeholder="Filter"
            />
          </Col>
        </Row>
      </Card>

      <Checkbox.Group
        className={styles.filterCardList}
        onChange={checked => setSelectedCards(checked)}
      >
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
    </PageHeaderWrapper>
  );
};

export default Candidates;
