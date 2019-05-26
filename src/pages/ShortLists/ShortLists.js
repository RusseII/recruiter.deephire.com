import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { getArchivedShortlists, getShortLists } from '@/services/api';
import { AutoComplete, Card, Col, message, Row, Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import readableTime from 'readable-timestamp';
import router from 'umi/router';
import styles from './ShortLists.less';
import ArchiveButton from '@/components/ArchiveButton';

const openShortListAnalytics = data => {
  const { _id } = data;
  router.push(`/shortlists/shortlistanalytics/?id=${_id}`);
};

const columns = [
  {
    title: 'Shared With',
    render: data => {
      const { name, email } = data;
      return (
        <>
          <div>{name}</div>
          <div>{email}</div>
        </>
      );
    },
  },
  {
    title: 'Analytics',
    render: data => <a onClick={() => openShortListAnalytics(data)}>View</a>,
  },
  {
    title: 'Last Viewed',
    render: data => {
      const { clicks } = data;
      const clickCount = clicks ? clicks.length : 0;
      const dateObj = clicks ? new Date(clicks[clickCount - 1]) : '-';
      const displayTime = clicks ? readableTime(dateObj) : '-';
      return displayTime || '-';
    },
  },
  {
    title: 'View Count',
    render: data => {
      const { clicks } = data;
      const clickCount = clicks ? clicks.length : 0;
      return <div className={styles.clickCount}>{clickCount || '-'}</div>;
    },
  },
  {
    title: 'Share Link',
    render: data => {
      const { shortUrl } = data;

      return (
        <Tooltip title="Click to copy">
          <CopyToClipboard text={shortUrl} onCopy={() => message.success('Link Copied')}>
            <a>{shortUrl || '-'}</a>
          </CopyToClipboard>
        </Tooltip>
      );
    },
  },
];
const ShortLists = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [archives, setArchives] = useState(false);

  const createDataSource = data => {
    const searchDataSource = [];
    data.forEach(shortList => {
      if (shortList.email) searchDataSource.push(shortList.email);
      if (shortList.name) searchDataSource.push(shortList.name);
    });
    const unique = [...new Set(searchDataSource)];
    setDataSource(unique);
  };

  const getData = async () => {
    setLoading(true);
    const data = await (archives ? getArchivedShortlists() : getShortLists());
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
      candidate => candidate.email === searchTerm || candidate.name === searchTerm
    );
    setFilteredData(filteredData);
  };

  return (
    <PageHeaderWrapper title="Short Lists">
      <Card>
        <Row align="middle" type="flex" justify="space-between">
          <Col>
            {selectedRows.length !== 0 && (
              <ArchiveButton
                onClick={() => setSelectedRows([])}
                reload={getData}
                archives={archives}
                route="shortlists"
                archiveData={selectedRows}
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

      <Card bordered={false}>
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          data={{ list: filteredData }}
          size="small"
          columns={columns}
          onSelectRow={rows => setSelectedRows(rows)}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default ShortLists;
