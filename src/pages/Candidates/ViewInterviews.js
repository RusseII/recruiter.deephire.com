/* eslint-disable camelcase */
import {
  EditOutlined,
  ShareAltOutlined,
  UserAddOutlined,
  PieChartOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import router from 'umi/router';

import { message, Card, Tooltip, ConfigProvider, Alert, Button, Drawer, Tag, Tabs } from 'antd';
import React, { Fragment, useEffect, useState, useContext } from 'react';
import readableTime from 'readable-timestamp';
import StandardTable from '@/components/StandardTable';
import TableToolbar from '@/components/StandardTable/TableToolbar';

import { getInterviews, getArchivedInterviews, updateInterviews } from '@/services/api';
import ArchiveButton from '@/components/ArchiveButton';
import customEmpty from '@/components/CustomEmpty';

import CloneButton from '@/components/CloneButton';

import Step1 from '@/pages/Interviews/CreateInterviewForm/Step1';
import GlobalContext from '@/layouts/MenuContext';
import InviteCandidates from '@/components/InviteCandidates';
import UpgradeButton from '@/components/Upgrade/UpgradeButton';
import AntPageHeader from '@/components/PageHeader/AntPageHeader';

// const isAdmin = () => JSON.stringify(getAuthority()) === JSON.stringify(['admin']);

const TableList = () => {
  const globalData = useContext(GlobalContext);

  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [archives, setArchives] = useState(false);
  const [editInterview, setEditInterview] = useState(null);
  const [inviteCandidates, setInviteCandidates] = useState(null);
  const [reload, setReload] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState(null);

  const handleChange = (pagination, filters) => {
    setFilteredInfo(filters);
  };
  const { interviews, setInterviews, stripeProduct, recruiterProfile } = globalData;

  // const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState(interviews);

  const [unArchivedInterviewCount, setUnArchivedInterviewCount] = useState(null);

  // const createDataSource = data => {
  //   const searchDataSource = [];
  //   data.forEach(interview => {
  //     if (interview.interviewName) searchDataSource.push(interview.interviewName);
  //   });
  //   const unique = [...new Set(searchDataSource)];
  //   setDataSource(unique);
  // };
  // eslint-disable-next-line camelcase
  // const team = recruiterProfile?.app_metadata?.team;
  // if (interviews) {
  //   interviews = interviews.map((interview, i) => ({ key: `interview-${i}`, ...interview }));
  // }
  const { allowedInterviews } = stripeProduct.metadata;
  const updateInterview = async cleanedValueData => {
    await updateInterviews(editInterview._id, cleanedValueData);
    setEditInterview(null);
    message.success('Interview Updated');
  };

  const openShortListAnalytics = data => {
    const { _id } = data;
    router.push(`/one-way/jobs/analytics/?id=${_id}`);
  };

  const columns = [
    {
      title: 'Job Name',
      dataIndex: 'interviewName',
      sorter: (a, b) => a.interviewName.localeCompare(b.interviewName),
    },

    {
      title: 'Job Questions',
      width: '40%',
      render(x, data) {
        try {
          const listItems = data.interviewQuestions.map(d => (
            <div>
              <li key={d.question}>{d.question}</li>
              <br />
            </div>
          ));
          return <div>{listItems} </div>;
        } catch {
          return null;
        }
      },
    },
    // TODO - make this only visable if there are teamas
    {
      title: 'Team',
      key: 'createdByTeam',
      // className: styles.hidden,
      dataIndex: 'createdByTeam',
      filters: [
        ...new Set(
          filteredData
            .map(shareLink => shareLink?.createdByTeam)
            .filter(value => value !== undefined)
        ),
      ].map(createdByTeam => ({ text: createdByTeam, value: createdByTeam })),
      filteredValue: filteredInfo?.createdByTeam || null,

      onFilter: (value, record) =>
        record.createdByTeam ? record.createdByTeam.indexOf(value) === 0 : false,
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
      title: 'Created By',
      key: 'createdBy',
      sorter: (a, b) => a.createdBy.localeCompare(b.createdBy),
      filters: [
        ...new Set(
          filteredData.map(shareLink => shareLink?.createdBy).filter(value => value !== undefined)
        ),
      ].map(createdBy => ({ text: createdBy, value: createdBy })),
      filteredValue: filteredInfo?.createdBy || null,

      onFilter: (value, record) => record.createdBy.indexOf(value) === 0,
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
      // calculdate width by (icons (4) * 14) + ( margin (16) * 2) + (marginBetweenIcons (8) * 3 )
      width: 112,
      render: data => {
        return (
          <Fragment>
            <Tooltip title="Invite candidates">
              <UserAddOutlined onClick={() => setInviteCandidates({ activeTab: '1', ...data })} />
            </Tooltip>

            <Tooltip title="View direct interview link">
              <ShareAltOutlined
                onClick={() => setInviteCandidates({ activeTab: '2', ...data })}
                style={{ marginLeft: 8 }}
              />
            </Tooltip>

            <Tooltip title="Edit interview">
              <EditOutlined onClick={() => setEditInterview(data)} style={{ marginLeft: 8 }} />
            </Tooltip>

            <Tooltip title="View Analytics">
              <PieChartOutlined
                onClick={() => openShortListAnalytics(data)}
                style={{ marginLeft: 8 }}
              />
            </Tooltip>
          </Fragment>
        );
      },
    },
  ];

  const getData = async () => {
    setLoading(true);
    let data;
    if (archives) {
      data = await getArchivedInterviews();
      const interviewDataForLength = await getInterviews();
      setUnArchivedInterviewCount(interviewDataForLength.length || 0);
    } else {
      data = await getInterviews();
      setUnArchivedInterviewCount(data.length || 0);
    }
    // if (team) {
    //   data = data.filter(interview => {
    //     if (!interview.createdByTeam) return null;
    //     return interview.createdByTeam.includes(team);
    //   });
    // }
    // createDataSource(data || []);
    setInterviews(data || []);
    setFilteredData(data || []);

    setLoading(false);
  };
  useEffect(() => {
    if (recruiterProfile) {
      getData();
    }
  }, [archives, reload, recruiterProfile]);

  useEffect(() => {
    if (recruiterProfile) {
      setFilteredInfo(values => ({
        ...values,
        createdByTeam: recruiterProfile?.app_metadata?.team
          ? [recruiterProfile?.app_metadata?.team]
          : null,
      }));
    }
  }, [recruiterProfile?.app_metadata?.team]);
  // const shouldClear = value => {
  //   if (!value) {
  //     setFilteredData(interviews);
  //   }
  // };

  // const filter = searchTerm => {
  //   const filteredData = globalData.interviews.filter(
  //     interview => interview.interviewName === searchTerm
  //   );
  //   setFilteredData(filteredData);
  // };

  return (
    <>
      <AntPageHeader
        title="Jobs"
        subTitle="Invite candidates to a job to have them complete a one-way interview "
        onBack={null}
        tags={
          unArchivedInterviewCount && allowedInterviews ? (
            <Tooltip title="Number of job slots used">
              <Tag color={unArchivedInterviewCount / allowedInterviews >= 1 ? 'red' : 'blue'}>
                {`${unArchivedInterviewCount}/${allowedInterviews}`}
              </Tag>
            </Tooltip>
          ) : null
        }
        extra={
          <Button
            type="primary"
            onClick={() => router.push('/one-way/jobs/create/info')}
            ghost
            icon={<PlusOutlined />}
          >
            Create Job
          </Button>
        }
        footer={
          <Tabs
            defaultActiveKey="1"
            onChange={() => {
              setArchives(flag => !flag);
              setSelectedRows([]);
            }}
          >
            <Tabs.TabPane tab="Active Jobs" key="1" />
            <Tabs.TabPane tab="Hidden Jobs" key="2" />
          </Tabs>
        }
      />
      <InviteCandidates
        setInviteCandidates={setInviteCandidates}
        inviteCandidates={inviteCandidates}
        setReload={setReload}
      />

      <Drawer
        destroyOnClose
        title="Edit Interview"
        visible={Boolean(editInterview)}
        onClose={() => setEditInterview(false)}
        width={window.innerWidth > 720 ? 378 : null}
        drawerStyle={{ backgroundColor: '#f0f2f5' }}
      >
        <Step1 setReload={setReload} onClick={updateInterview} data={editInterview} />
      </Drawer>

      {allowedInterviews && unArchivedInterviewCount > allowedInterviews && (
        <Alert
          style={{ marginBottom: 20 }}
          message="Interview Cap Exceeded"
          description={
            <div>
              {`You have more interviews than allowed on your plan. Some of your interviews may be
              removed. Please archive unused interviews, or `}
              <UpgradeButton text="upgrade your plan" type="link" style={{ padding: 0 }} />
            </div>
          }
          type="error"
          showIcon
        />
      )}

      {/* <AutoComplete
                style={{ width: 350 }}
                allowClear
                dataSource={dataSource}
                onSelect={filter}
                onSearch={shouldClear}
                filterOption={(inputValue, option) =>
                  option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                placeholder="Filter"
              /> */}

      <Card bordered={false}>
        <TableToolbar
          selectedInfo={{ type: 'Jobs', count: selectedRows.length }}
          reload={getData}
          extra={
            <>
              <CloneButton
                onClick={() => setSelectedRows([])}
                reload={getData}
                cloneData={selectedRows}
                disabled={selectedRows.length === 0}
                style={{ marginRight: 8 }}
              />
              <ArchiveButton
                onClick={() => setSelectedRows([])}
                reload={getData}
                archives={archives}
                route="interviews"
                archiveData={selectedRows}
                disabled={selectedRows.length === 0}
              />
            </>
          }
        />

        <ConfigProvider
          renderEmpty={() => customEmpty('No Jobs', '/one-way/jobs/create/info', 'Create Job')}
        >
          <StandardTable
            onChange={handleChange}
            selectedRows={selectedRows}
            loading={loading}
            data={{ list: filteredData }}
            // size="small"
            columns={columns}
            onSelectRow={rows => setSelectedRows(rows)}
          />
        </ConfigProvider>
      </Card>
    </>
  );
};

// const AllowedInterviews = ({ totalInterviews, allowedInterviews }) => (
//   <Tooltip title="Total interviews used">
//     <div>
//       <Statistic
//         style={{ marginRight: 16 }}
//         valueStyle={totalInterviews > allowedInterviews ? { color: 'red' } : null}
//         value={totalInterviews}
//         suffix={`/ ${allowedInterviews}`}
//       />
//     </div>
//   </Tooltip>
// );

export default TableList;
