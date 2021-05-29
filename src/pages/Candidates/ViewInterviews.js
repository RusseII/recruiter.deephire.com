/* eslint-disable camelcase */
import {
  EditOutlined,
  ShareAltOutlined,
  UserAddOutlined,
  PieChartOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import router from 'umi/router';

import {
  message,
  Card,
  Tooltip,
  ConfigProvider,
  Alert,
  Button,
  Drawer,
  Tag,
  Tabs,
  Space,
} from 'antd';
import React, { useEffect, useState, useContext } from 'react';
import readableTime from 'readable-timestamp';
import { handleFilter } from '@bit/russeii.deephire.utils.utils';
import { useJobs, useJobsArchives } from '@/services/apiHooks';
import StandardTable from '@/components/StandardTable';
import TableToolbar from '@/components/StandardTable/TableToolbar';

import { updateInterviews } from '@/services/api';
import ArchiveButton from '@/components/ArchiveButton';
import customEmpty from '@/components/CustomEmpty';

// import CloneButton from '@/components/CloneButton';

import Step1 from '@/pages/Interviews/CreateInterviewForm/Step1';
import GlobalContext from '@/layouts/MenuContext';
import InviteCandidates from '@/components/InviteCandidates';
import UpgradeButton from '@/components/Upgrade/UpgradeButton';
import AntPageHeader from '@/components/PageHeader/AntPageHeader';

import { useSearch } from '@/services/complexHooks';

// const isAdmin = () => JSON.stringify(getAuthority()) === JSON.stringify(['admin']);

const TableList = () => {
  const globalData = useContext(GlobalContext);

  const getColumnSearchProps = useSearch();

  const [selectedRows, setSelectedRows] = useState([]);
  const [archives, setArchives] = useState(false);
  const [editInterview, setEditInterview] = useState(null);
  const [inviteCandidates, setInviteCandidates] = useState(null);
  // const [reload, setReload] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState(null);

  const handleChange = (pagination, filters) => {
    setFilteredInfo(filters);
  };
  const { stripeProduct, recruiterProfile } = globalData;
  const { data: jobs, isLoading, mutate: mutateJobs } = useJobs();

  const { data: jobsArchives, mutate: mutateJobsArchives } = useJobsArchives();

  const correctData = archives ? jobsArchives : jobs;

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
      key: 'interviewName',
      sorter: (a, b) => a.interviewName.localeCompare(b.interviewName),
      filteredValue: filteredInfo?.interviewName || null,
      ...getColumnSearchProps('interviewName', 'Job Name'),
    },

    {
      title: 'Job Questions',
      dataIndex: 'interviewQuestions',
      filteredValue: filteredInfo?.interviewQuestions || null,
      ...getColumnSearchProps('interviewQuestions', 'Job Questions', 'question'),
      // width: '40%',
      // render(x, data) {
      //   try {
      //     const listItems = data.interviewQuestions.map(d => (
      //       <div>
      //         <li key={d.question}>{d.question}</li>
      //         <br />
      //       </div>
      //     ));
      //     return <div>{listItems} </div>;
      //   } catch {
      //     return null;
      //   }
      // },
    },
    // TODO - make this only visable if there are teamas

    {
      title: 'Created By',
      key: 'createdBy',
      sorter: (a, b) => a.createdBy.localeCompare(b.createdBy),
      ...handleFilter(correctData || [], 'createdBy'),
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
      ...handleFilter(correctData || [], 'createdByTeam'),
      filteredValue: filteredInfo?.createdByTeam || null,

      // record.createdByTeam ? record.createdByTeam.indexOf(value) === 0 : false,
      // }
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
      fixed: 'right',
      key: 'action',

      render: data => {
        return (
          <Space>
            <Tooltip title="Invite candidates">
              <UserAddOutlined onClick={() => setInviteCandidates({ activeTab: '1', ...data })} />
            </Tooltip>

            <Tooltip title="View direct interview link">
              <ShareAltOutlined onClick={() => setInviteCandidates({ activeTab: '2', ...data })} />
            </Tooltip>

            <Tooltip title="Edit interview">
              <EditOutlined onClick={() => setEditInterview(data)} />
            </Tooltip>

            <Tooltip title="View Analytics">
              <PieChartOutlined onClick={() => openShortListAnalytics(data)} />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  // const getData = async () => {
  //   setLoading(true);
  //   let data;
  //   if (archives) {
  //     data = await getArchivedInterviews();
  //     const interviewDataForLength = await getInterviews();
  //     setUnArchivedInterviewCount(interviewDataForLength.length || 0);
  //   } else {
  //     data = await getInterviews();
  //     setUnArchivedInterviewCount(data.length || 0);
  //   }
  //   // if (team) {
  //   //   data = data.filter(interview => {
  //   //     if (!interview.createdByTeam) return null;
  //   //     return interview.createdByTeam.includes(team);
  //   //   });
  //   // }
  //   // createDataSource(data || []);
  //   setInterviews(data || []);
  //   setFilteredData(data || []);

  //   setLoading(false);
  // };

  useEffect(() => {
    const team = recruiterProfile?.app_metadata?.team;
    if (!team) return;

    setFilteredInfo(values => ({
      ...values,
      createdByTeam: Array.isArray(team) ? team : [team],
    }));
  }, [recruiterProfile?.app_metadata?.team]);

  const reload = () => {
    if (archives) {
      mutateJobsArchives();
    } else {
      mutateJobs();
    }
  };

  useEffect(() => {
    reload();
  }, [archives]);

  return (
    <>
      <AntPageHeader
        title="Jobs"
        subTitle="Invite candidates to a job to have them complete a one-way interview "
        onBack={null}
        tags={
          jobs?.length && allowedInterviews ? (
            <Tooltip title="Number of job slots used">
              <Tag color={jobs.length / allowedInterviews >= 1 ? 'red' : 'blue'}>
                {`${jobs.length}/${allowedInterviews}`}
              </Tag>
            </Tooltip>
          ) : null
        }
        footer={
          <Tabs
            defaultActiveKey="1"
            onChange={() => {
              setArchives(flag => !flag);
              setSelectedRows([]);
            }}
          >
            <Tabs.TabPane tab="Active" key="1" />
            <Tabs.TabPane tab="Hidden" key="2" />
          </Tabs>
        }
      />
      <InviteCandidates
        setInviteCandidates={setInviteCandidates}
        inviteCandidates={inviteCandidates}
        setReload={reload}
      />

      <Drawer
        destroyOnClose
        title="Edit Interview"
        visible={Boolean(editInterview)}
        onClose={() => setEditInterview(false)}
        width={window.innerWidth > 720 ? 378 : null}
        drawerStyle={{ backgroundColor: '#f0f2f5' }}
      >
        <Step1 setReload={reload} onClick={updateInterview} data={editInterview} />
      </Drawer>

      {allowedInterviews && jobs?.length > allowedInterviews && (
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
          reload={reload}
          extra={
            <Space>
              <Button
                type="primary"
                onClick={() => router.push('/one-way/jobs/create/info')}
                icon={<PlusOutlined />}
              >
                Create Job
              </Button>
              {/* <CloneButton
                onClick={() => setSelectedRows([])}
                reload={reload}
                cloneData={selectedRows}
                disabled={selectedRows.length === 0}
              /> */}
              <ArchiveButton
                onClick={() => setSelectedRows([])}
                reload={reload}
                archives={archives}
                route="interviews"
                archiveData={selectedRows}
                disabled={selectedRows.length === 0}
              />
            </Space>
          }
        />

        <ConfigProvider
          renderEmpty={() => customEmpty('No Jobs', '/one-way/jobs/create/info', 'Create Job')}
        >
          <StandardTable
            onChange={handleChange}
            selectedRows={selectedRows}
            loading={isLoading}
            data={{ list: correctData }}
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
