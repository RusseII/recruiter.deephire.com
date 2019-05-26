import CandidateCard from '@/components/CandidateCard';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ShareCandidateButton from '@/components/ShareCandidateButton';
import ArchiveButton from '@/components/ArchiveButton';

import { getArchivedVideos, getVideos } from '@/services/api';
import { AutoComplete, Card, Checkbox, Col, List, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './Candidates.less';

const Candidates = () => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [archives, setArchives] = useState(false);

  const createDataSource = data => {
    const searchDataSource = [];
    data.forEach(candidate => {
      if (candidate.userName) searchDataSource.push(candidate.userName);
      if (candidate.candidateEmail) searchDataSource.push(candidate.candidateEmail);
      if (candidate.interviewName) searchDataSource.push(candidate.interviewName);
    });
    const unique = [...new Set(searchDataSource)];
    setDataSource(unique);
  };

  const getData = async () => {
    setLoading(true);
    const data = await (archives ? getArchivedVideos() : getVideos());
    createDataSource(data || []);
    setData(data || []);
    setFilteredData(data || []);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [archives]);

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
        <Row align="middle" type="flex" justify="space-between">
          <Col>
            <ShareCandidateButton
              marginRight
              isDisabled={selectedCards.length === 0}
              candidateData={selectedCards}
            />
            {selectedCards.length !== 0 && (
              <ArchiveButton
                onClick={() => setSelectedCards([])}
                reload={getData}
                archives={archives}
                route="videos"
                archiveData={selectedCards}
              />
            )}

            <AutoComplete
              allowClear
              dataSource={dataSource}
              onSelect={filter}
              onSearch={shouldClear}
              filterOption={(inputValue, option) =>
                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              placeholder="Filter"
            />
          </Col>
          <a onClick={() => setArchives(!archives)}>{archives ? 'View All' : 'View Archived'} </a>
        </Row>
      </Card>

      <Checkbox.Group
        className={styles.filterCardList}
        onChange={checked => setSelectedCards(checked)}
        value={selectedCards}
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
