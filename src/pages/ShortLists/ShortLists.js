import router from 'umi/router';
import { AutoComplete, Card, Col, message, Row, Tooltip, ConfigProvider } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import readableTime from 'readable-timestamp';
import styles from './ShortLists.less';
import ArchiveButton from '@/components/ArchiveButton';
import { getHttpUrl } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { getArchivedShortlists, getShortLists } from '@/services/api';
import customEmpty from '@/components/CustomEmpty';

import GlobalContext from '@/layouts/MenuContext';

const openShortListAnalytics = data => {
  const { _id } = data;
  router.push(`/shortlists/shortlistanalytics/?id=${_id}`);
};

const columns = [
  {
    title: 'Shared With',
    render: data => {
      const { name, email, description } = data;
      return (
        <>
          <div>{name}</div>
          <div>{description}</div>
          <div>{email}</div>
          <a onClick={() => openShortListAnalytics(data)}>View Analytics </a>
        </>
      );
    },
  },
  // {
  //   title: 'Analytics',
  //   render: data => <a onClick={() => openShortListAnalytics(data)}>View</a>,
  // },
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
    title: 'Created By',
    render(test, data) {
      const { createdBy } = data;
      try {
        const dateObj = new Date(data.timestamp);
        const displayTime = readableTime(dateObj);
        return (
          <>
            <div>{createdBy}</div>
            <div>{displayTime}</div>
          </>
        );
      } catch {
        return createdBy;
      }
    },
  },
  {
    title: 'Share Link',
    fixed: 'right',
    render: data => {
      const { shortUrl } = data;

      return (
        <Tooltip title="Click to copy">
          <CopyToClipboard
            text={getHttpUrl(shortUrl)}
            onCopy={() => message.success('Link Copied')}
          >
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
  const [dataSource, setDataSource] = useState([]);
  const [archives, setArchives] = useState(false);

  const globalData = useContext(GlobalContext);
  const [filteredData, setFilteredData] = useState(globalData.shareLinks);

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
    globalData.setShareLinks(data || []);
    setFilteredData(data || []);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [archives]);

  const shouldClear = value => {
    if (!value) {
      setFilteredData(globalData.shortLinks);
    }
  };

  const filter = searchTerm => {
    const filteredData = globalData.shortLinks.filter(
      candidate => candidate.email === searchTerm || candidate.name === searchTerm
    );
    setFilteredData(filteredData);
  };

  return (
    <PageHeaderWrapper title="Share Links">
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
        <ConfigProvider
          renderEmpty={() =>
            customEmpty('No Share Links', '/candidates/candidates', 'View Candidates')
          }
        >
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={{ list: filteredData }}
            columns={columns}
            onSelectRow={rows => setSelectedRows(rows)}
          />
        </ConfigProvider>
      </Card>
    </PageHeaderWrapper>
  );
};

export default ShortLists;
