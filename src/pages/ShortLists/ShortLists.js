import router from 'umi/router';
import {
  AutoComplete,
  Card,
  Col,
  Row,
  Tooltip,
  ConfigProvider,
  Button,
  Typography,
  Popover,
} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import readableTime from 'readable-timestamp';
import styles from './ShortLists.less';
import ArchiveButton from '@/components/ArchiveButton';
import { getHttpUrl } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { getArchivedShortlists, getShortLists } from '@/services/api';
import customEmpty from '@/components/CustomEmpty';

import GlobalContext from '@/layouts/MenuContext';

const { Text } = Typography;
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
    title: '',
    fixed: 'right',
    render: data => <Actions data={data} />,
  },
];

const Actions = ({ data }) => {
  const [visibility, setVisibility] = useState({ hovered: false, clicked: false });
  return (
    <>
      <Tooltip
        title="View share link"
        trigger="hover"
        visible={visibility.hovered}
        onVisibleChange={visible => setVisibility({ hovered: visible, clicked: false })}
      >
        <Popover
          title="Share this link with your client"
          content={<Text copyable>{getHttpUrl(data.shortUrl)}</Text>}
          trigger="click"
          visible={visibility.clicked}
          onVisibleChange={visible => setVisibility({ hovered: false, clicked: visible })}
        >
          <Button style={{ marginLeft: 8 }} shape="circle" icon="link" />
        </Popover>
      </Tooltip>
      <Tooltip title="View share link analytics">
        <Button
          onClick={() => openShortListAnalytics(data)}
          style={{ marginLeft: 8 }}
          shape="circle"
          icon="pie-chart"
        />
      </Tooltip>
    </>
  );
};
const ShortLists = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [archives, setArchives] = useState(false);

  const globalData = useContext(GlobalContext);
  const [filteredData, setFilteredData] = useState(globalData.shareLinks);
  const recruiterProfile = globalData?.recruiterProfile;

  // eslint-disable-next-line camelcase
  const team = recruiterProfile?.app_metadata?.team;
  const createDataSource = data => {
    const searchDataSource = [];
    data.forEach(shortList => {
      if (shortList.email) searchDataSource.push(shortList.email);
      if (shortList.name) searchDataSource.push(shortList.name);
    });
    const unique = [...new Set(searchDataSource)];
    setDataSource(unique);
  };

  useEffect(() => {});
  const getData = async () => {
    setLoading(true);
    let data = await (archives ? getArchivedShortlists() : getShortLists());
    // eslint-disable-next-line camelcase

    if (team) {
      data = data.filter(shareLink => shareLink.createdByTeam === team);
    }
    createDataSource(data || []);
    globalData.setShareLinks(data || []);
    setFilteredData(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (recruiterProfile) {
      getData();
    }
  }, [archives, recruiterProfile]);

  const shouldClear = value => {
    if (!value) {
      setFilteredData(globalData.shareLinks);
    }
  };

  const filter = searchTerm => {
    const filteredData = globalData.shareLinks.filter(
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
