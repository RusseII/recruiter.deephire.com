/* eslint-disable camelcase */
import router from 'umi/router';
import { ShareAltOutlined, PieChartOutlined } from '@ant-design/icons';
import { Card, Tooltip, ConfigProvider, Tag, Typography, Popover, Tabs, Space } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import readableTime from 'readable-timestamp';
import { getHttpUrl, handleFilter } from '@bit/russeii.deephire.utils.utils';
import ArchiveButton from '@/components/ArchiveButton';
import StandardTable from '@/components/StandardTable';
import TableToolbar from '@/components/StandardTable/TableToolbar';

import { getArchivedShortlists, getShortLists } from '@/services/api';
import customEmpty from '@/components/CustomEmpty';
import AntPageHeader from '@/components/PageHeader/AntPageHeader';

import GlobalContext from '@/layouts/MenuContext';

const { Text } = Typography;
const openShortListAnalytics = data => {
  const { _id } = data;
  router.push(`/sharelinks/analytics/?id=${_id}`);
};

const ShortLists = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [dataSource, setDataSource] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState(null);

  const [archives, setArchives] = useState(false);

  const globalData = useContext(GlobalContext);
  const [filteredData, setFilteredData] = useState(globalData.shareLinks);
  const recruiterProfile = globalData?.recruiterProfile;

  const handleChange = (pagination, filters) => {
    setFilteredInfo(filters);
  };

  const columns = [
    {
      title: 'Shared With',
      key: 'sharedWith',

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
    {
      title: 'Last Viewed',
      key: 'lastViewed',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const { clicks: clicksA } = a;
        const { clicks: clicksB } = b;
        const clickCountA = clicksA ? clicksA.length : 0;
        const clickCountB = clicksB ? clicksB.length : 0;

        const dateObjA = clicksA ? new Date(clicksA[clickCountA - 1]) : null;
        const dateObjB = clicksB ? new Date(clicksB[clickCountB - 1]) : null;

        return dateObjA - dateObjB;
      },
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
      key: 'views',
      dataIndex: 'clicks',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const { clicks: clicksA } = a;
        const { clicks: clicksB } = b;
        const clickCountA = clicksA ? clicksA.length : 0;
        const clickCountB = clicksB ? clicksB.length : 0;
        return clickCountA - clickCountB;
      },

      render: clicks => {
        return <>{clicks ? clicks.length : '-'}</>;
      },
    },
    {
      title: 'Created By',
      key: 'createdBy',
      sorter: (a, b) => a.createdBy.localeCompare(b.createdBy),
      ...handleFilter(filteredData, 'createdBy'),
      filteredValue: filteredInfo?.createdBy || null,

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
      title: 'Team',
      key: 'createdByTeam',
      // className: styles.hidden,
      dataIndex: 'createdByTeam',
      ...handleFilter(filteredData, 'createdByTeam'),
      filteredValue: filteredInfo?.createdByTeam || null,
      render: createdByTeam => {
        if (createdByTeam) {
          return Array.isArray(createdByTeam) ? (
            createdByTeam.map(team => <Tag>{team}</Tag>)
          ) : (
            <Tag>{createdByTeam}</Tag>
          );
        }
        return null;
      },
      // defaultFilteredValue: [''],
      // defaultFilteredValue: [recruiterProfile?.app_metadata?.team || ''],
    },

    {
      title: '',
      key: 'actions',
      fixed: 'right',
      // calculdate width by (icons (2) * 14) + ( margin (16) * 2) + (marginBetweenIcons (8))
      width: 68,
      render: data => <Actions data={data} />,
    },
  ];

  const Actions = ({ data }) => {
    const [visibility, setVisibility] = useState({ hovered: false, clicked: false });
    return (
      <Space>
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
            <ShareAltOutlined />
          </Popover>
        </Tooltip>
        <Tooltip title="View share link analytics">
          <PieChartOutlined onClick={() => openShortListAnalytics(data)} />
        </Tooltip>
      </Space>
    );
  };

  // eslint-disable-next-line camelcase
  // const team = recruiterProfile?.app_metadata?.team;

  const getData = async () => {
    setLoading(true);
    const data = await (archives ? getArchivedShortlists() : getShortLists());
    // eslint-disable-next-line camelcase

    // if (team) {
    //   data = data.filter(shareLink => {
    //     if (!shareLink.createdByTeam) return null;
    //     return shareLink.createdByTeam.includes(team);
    //   });
    // }
    globalData.setShareLinks(data || []);
    setFilteredData(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (recruiterProfile) {
      getData();
    }
  }, [archives, recruiterProfile]);

  useEffect(() => {
    const team = recruiterProfile?.app_metadata?.team;
    if (!team) return;

    setFilteredInfo(values => ({
      ...values,
      createdByTeam: Array.isArray(team) ? team : [team],
    }));
  }, [recruiterProfile?.app_metadata?.team]);

  return (
    <>
      <AntPageHeader
        title="Share Links"
        subTitle="Public links that let people outside of your team view candidates"
        onBack={null}
        footer={
          <Tabs
            defaultActiveKey="1"
            onChange={() => {
              setArchives(flag => !flag);
              setSelectedRows([]);
            }}
          >
            <Tabs.TabPane tab="All" key="1" />
            <Tabs.TabPane tab="Hidden" key="2" />
          </Tabs>
        }
      />
      {/* <div style={{ marginBottom: 16 }} /> */}

      <Card bordered={false}>
        <TableToolbar
          selectedInfo={{ type: 'Share Links', count: selectedRows.length }}
          reload={getData}
          extra={
            <ArchiveButton
              onClick={() => setSelectedRows([])}
              reload={getData}
              archives={archives}
              route="shortlists"
              archiveData={selectedRows}
              disabled={selectedRows.length === 0}
            />
          }
        />
        {/* <Row style={{ marginTop: -8, marginBottom: 16 }} justify="space-between">
          <span style={{ marginTop: 8 }}>{`Selected ${selectedRows.length} Share Links`}</span>
          <span>
           
            <Reload onClick={getData} />
          </span>
        </Row> */}
        <ConfigProvider
          renderEmpty={() =>
            customEmpty('No Share Links', 'one-way/candidates/', 'View Candidates')
          }
        >
          <StandardTable
            onChange={handleChange}
            selectedRows={selectedRows}
            loading={loading}
            data={{ list: filteredData }}
            columns={columns}
            onSelectRow={rows => setSelectedRows(rows)}
          />
        </ConfigProvider>
      </Card>
    </>
  );
};

export default ShortLists;
