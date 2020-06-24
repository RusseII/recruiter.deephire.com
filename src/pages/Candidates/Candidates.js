import {
  AutoComplete,
  Card,
  Checkbox,
  Col,
  List,
  Input,
  ConfigProvider,
  Popconfirm,
  Button,
  Skeleton,
  Tabs,
  Row,
} from 'antd';
import React, { useEffect, useState, useContext } from 'react';
import CandidateCard from '@/components/CandidateCard';
// import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ShareCandidateButton from '@/components/ShareCandidateButton';
import ArchiveButton from '@/components/ArchiveButton';

import { getArchivedVideos, getVideos, removeCandidates } from '@/services/api';
import styles from './Candidates.less';
import customEmpty from '@/components/CustomEmpty';

import GlobalContext from '@/layouts/MenuContext';
import { getAuthority } from '@/utils/authority';

import AntPageHeader from '@/components/PageHeader/AntPageHeader';

const isAdmin = () => JSON.stringify(getAuthority()) === JSON.stringify(['admin']);

const Candidates = () => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [archives, setArchives] = useState(false);

  const globalData = useContext(GlobalContext);
  const { videos, setVideos, recruiterProfile } = globalData;

  // eslint-disable-next-line camelcase
  const team = recruiterProfile?.app_metadata?.team;

  const [filteredData, setFilteredData] = useState(videos);

  const candidateCount = Number(localStorage.getItem('candidateCount'));
  const countOfCandidates = new Array(candidateCount).fill(5);

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
    let data = await (archives ? getArchivedVideos() : getVideos());
    if (team) {
      data = data.filter(video => {
        if (!video.completeInterviewData?.interviewData?.createdByTeam) return null;
        return video.completeInterviewData?.interviewData?.createdByTeam.includes(team);
      });
    }
    createDataSource(data || []);
    setVideos(data || []);
    setFilteredData(data || []);
    setLoading(false);
    localStorage.setItem('candidateCount', filteredData.length);
  };

  useEffect(() => {
    if (recruiterProfile) {
      getData();
    }
  }, [archives, recruiterProfile]);

  const shouldClear = value => {
    if (!value) {
      setFilteredData(videos);
    }
  };

  const filter = searchTerm => {
    const filteredData = videos.filter(
      candidate =>
        candidate.candidateEmail === searchTerm ||
        candidate.interviewName === searchTerm ||
        candidate.userName === searchTerm
    );
    setFilteredData(filteredData);
  };

  const handleDelete = () => {
    // removes multiple candidates
    removeCandidates(selectedCards, 'Deleted candidate data');
    setSelectedCards([]);
    getData();
  };
  return (
    <>
      <AntPageHeader
        title="Candidates"
        subTitle="View completed one way video interviews"
        onBack={null}
        footer={
          <Tabs onChange={() => setArchives(flag => !flag)}>
            <Tabs.TabPane tab="All Candidates" key="true" />
            <Tabs.TabPane tab="Hidden Candidates" key="false" />
          </Tabs>
        }
      >
        {/* <Row align="middle" type="flex" justify="space-between">
          <Col>
            <ShareCandidateButton
              marginRight
              isDisabled={selectedCards.length === 0}
              candidateData={selectedCards}
            />
            {selectedCards.length !== 0 && (
              <span>
                <ArchiveButton
                  onClick={() => setSelectedCards([])}
                  reload={getData}
                  archives={archives}
                  route="videos"
                  archiveData={selectedCards}
                />

                {isAdmin() ? (
                  <Popconfirm
                    title="Permanently delete selected videos? All data will be deleted from our servers & unrecoverable."
                    onConfirm={handleDelete}
                    // onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="danger" style={{ marginRight: 16 }}>
                      Delete
                    </Button>
                  </Popconfirm>
                ) : null}
              </span>
            )}

            <AutoComplete
              style={{ width: 350 }}
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
          <a onClick={() => setArchives(!archives)}>{archives ? 'View All' : 'View Hidden'} </a>
        </Row> */}
      </AntPageHeader>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <AutoComplete
            style={{ width: 200 }}
            allowClear
            dataSource={dataSource}
            onSelect={filter}
            onSearch={shouldClear}
            filterOption={(inputValue, option) =>
              option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          >
            <Input.Search placeholder="Filter Candidates" />
          </AutoComplete>
        </Col>
        <Col>
          <span>
            <ArchiveButton
              style={{ marginRight: 8 }}
              onClick={() => setSelectedCards([])}
              reload={getData}
              archives={archives}
              route="videos"
              disabled={selectedCards.length === 0}
              archiveData={selectedCards}
            />

            {isAdmin() ? (
              <Popconfirm
                title="Permanently delete selected videos? All data will be deleted from our servers & unrecoverable."
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  disabled={selectedCards.length === 0}
                  type="danger"
                  style={{ marginRight: 8 }}
                >
                  Delete
                </Button>
              </Popconfirm>
            ) : null}
          </span>
          <ShareCandidateButton
            // style={{ marginLeft: 8 }}
            isDisabled={selectedCards.length === 0}
            candidateData={selectedCards}
          />
        </Col>
      </Row>
      <Checkbox.Group
        className={styles.filterCardList}
        onChange={checked => setSelectedCards(checked)}
        value={selectedCards}
      >
        <ConfigProvider
          renderEmpty={() =>
            customEmpty('No Candidate Videos', '/interview/view', 'View Interviews')
          }
        >
          {loading && candidateCount ? (
            <List
              rowKey="id"
              grid={{ gutter: 24, xxl: 3, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}
              dataSource={countOfCandidates}
              renderItem={item => (
                <List.Item key={item.id}>
                  <Card style={{ height: 227 }}>
                    <Skeleton avatar paragraph={{ rows: 4 }} loading active />
                  </Card>
                </List.Item>
              )}
            />
          ) : (
            <List
              rowKey="id"
              grid={{ gutter: 24, xxl: 3, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}
              loading={loading}
              dataSource={filteredData}
              renderItem={item => (
                <List.Item key={item.id}>
                  <CandidateCard item={item} />
                </List.Item>
              )}
            />
          )}
        </ConfigProvider>
      </Checkbox.Group>
    </>
  );
};

export default Candidates;
