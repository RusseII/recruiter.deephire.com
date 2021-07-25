/* eslint-disable camelcase */
import {
  FileAddOutlined,
  VideoCameraOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { handleFilter, lowerCaseQueryParams } from '@bit/russeii.deephire.utils.utils';
import { Card, ConfigProvider, Space, Spin, Tabs, Tag, Tooltip, Popconfirm } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import router from 'umi/router';
import customEmpty from '@/components/CustomEmpty';
import AntPageHeader from '@/components/PageHeader/AntPageHeader';
import ShareInterview from '@/components/ShareInterview';
import StandardTable from '@/components/StandardTable';
import TableToolbar from '@/components/StandardTable/TableToolbar';
import GlobalContext from '@/layouts/MenuContext';
import { deleteLiveInterview } from '@/services/api';
import { useLives } from '@/services/apiHooks';
import { useSearch } from '@/services/complexHooks';
// import { useAsync } from '@/services/hooks';
import InviteDrawer from './ScheduleInterview';

const LiveInterviews = () => {
  const getColumnSearchProps = useSearch();

  const [filteredInfo, setFilteredInfo] = useState(null);

  const handleChange = (pagination, filters) => {
    setFilteredInfo(filters);
  };

  const { tab = '1', page = '1' } = lowerCaseQueryParams(window.location.search);

  const [activeTab, setActiveTab] = useState(tab);
  const [reload, setReload] = useState(false);

  const globalData = useContext(GlobalContext);

  // const { execute, pending, value } = useAsync(fetchLiveInterviews, false);
  const { data: value, isLoading: pending, mutate: execute } = useLives();

  const { recruiterProfile, liveInterviews, setLiveInterviews } = globalData;
  // eslint-disable-next-line camelcase

  // let liveInterViewTeamFilter = liveInterviews;

  // if (team) {
  //   liveInterViewTeamFilter = liveInterviews.filter(liveInterview => {
  //     if (!liveInterview.createdByTeam) return null;
  //     return liveInterview.createdByTeam.includes(team);
  //   });
  // }

  useEffect(() => {
    if (execute) {
      execute();
    }
  }, [reload]);

  useEffect(() => {
    const team = recruiterProfile?.app_metadata?.team;
    if (!team) return;

    setFilteredInfo(values => ({
      ...values,
      createdByTeam: Array.isArray(team) ? team : [team],
    }));
  }, [recruiterProfile?.app_metadata?.team]);

  useEffect(() => {
    if (value) setLiveInterviews(value);
  }, [value]);

  const columns = [
    {
      title: 'Interview Time',
      dataIndex: 'interviewTime',
      key: 'interviewTime',
      sorter: (a, b) => {
        const [startA] = a.interviewTime;
        const [startB] = b.interviewTime;
        return startA > startB;
      },
      render: startEndTime => {
        const [start, end] = startEndTime;
        const startDateObj = new Date(start);
        const endDateObj = new Date(end);

        const startDate = startDateObj.toLocaleString('en-US', {
          month: 'long',
          weekday: 'long',
          day: 'numeric',
        });
        const startTime = startDateObj.toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        });

        const endTime = endDateObj.toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        });
        return (
          <div>
            <div>{startDate}</div>
            <div>{`${startTime}-${endTime}`}</div>
          </div>
        );
      },
    },
    {
      title: 'Recruiter',
      key: 'createdBy',
      // ...getColumnSearchProps(,'Interviewer')
      sorter: (a, b) => {
        const compareA = a.clientName || a.recruiterName || a.createdBy;
        const compareB = b.clientName || b.recruiterName || b.createdBy;
        return compareA.localeCompare(compareB);
      },
      render: data => {
        const { createdBy, recruiterName, clientName, interviewType } = data;
        if (interviewType === 'client') {
          return clientName;
        }
        return recruiterName || createdBy;
      },
    },
    {
      title: 'Candidate Name',
      dataIndex: 'candidateName',
      key: 'candidateName',
      sorter: (a, b) => a.candidateName.localeCompare(b.candidateName),
      ...getColumnSearchProps('candidateName', 'Candidate Name'),
      filteredValue: filteredInfo?.candidateName || null,
    },
    {
      title: 'Candidate Email',
      dataIndex: 'candidateEmail',
      key: 'candidateEmail',
      sorter: (a, b) => a.candidateEmail.localeCompare(b.candidateEmail),
      ...getColumnSearchProps('candidateEmail', 'Candidate Email'),
      filteredValue: filteredInfo?.candidateEmail || null,
    },
    {
      title: 'Team',
      key: 'createdByTeam',
      // className: styles.hidden,
      dataIndex: 'createdByTeam',
      ...handleFilter(liveInterviews, 'createdByTeam'),
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
    },
    {
      title: 'Client',
      key: 'clientName',
      sorter: (a, b) => {
        if (a?.clientName && b?.clientName) {
          return a.clientName.localeCompare(b.clientName);
        }
        return false;
      },
      filteredValue: filteredInfo?.clientName || null,
      render: data => {
        const { clientName, clientEmail } = data;
        if (!(clientName || clientEmail)) {
          return null;
        }
        return (
          <>
            {' '}
            {clientName} <br /> {clientEmail}{' '}
          </>
        );
      },
    },
    activeTab !== '1'
      ? {
          title: 'View',
          key: 'view',
          fixed: 'right',
          // width: 50,

          render: (text, data) => {
            const { _id } = data;
            return (
              <a
                type="link"
                onClick={() => router.push(`/one-way/candidates/candidate/?liveid=${_id}`)}
              >
                View
              </a>
            );
          },
        }
      : null,
    activeTab !== '2'
      ? {
          title: '',
          key: 'action',
          fixed: 'right',
          // setting width here does NOTHINg and i have no idea why
          width: 64,
          render: (text, data) => {
            return <Actions data={data} execute={() => execute(data.id)} />;
          },
        }
      : null,
  ].filter(item => item !== null);

  // const { email } = recruiterProfile || {};
  // if (
  //   (email &&
  //     (email === 'demo@deephire.com' ||
  //       email.includes('deephire.com') ||
  //       email.includes('assistinghands') ||
  //       email.includes('russell') ||
  //       email.includes('apple') ||
  //       email.includes('rratcliffe57@gmail.com') ||
  //       email.includes('klingcare'))) ||
  //   email.includes('clockworkrecruiting.com')
  // ) {
  const upcomingInterviewsFiltered = liveInterviews.filter(liveInterview => {
    return new Date(liveInterview.interviewTime[1]) > new Date();
  });
  const upcomingInterviews = upcomingInterviewsFiltered.sort((a, b) => {
    return new Date(a.interviewTime[0]) - new Date(b.interviewTime[0]);
  });

  const pastInterviews = liveInterviews.filter(liveInterview => {
    return new Date(liveInterview.interviewTime[1]) < new Date();
  });

  const Actions = ({ data, execute }) => {
    const { interviewLink } = data;

    // const update = () => {
    //   onClick()
    //   set
    // }

    const confirmDelete = async id => {
      await deleteLiveInterview(id);
      execute();
    };

    return (
      <Space>
        <Tooltip title="Join the interview">
          <VideoCameraOutlined
            onClick={() => window.open(`${interviewLink}?role=recruiter`, '_blank')}
          />
        </Tooltip>
        <ShareInterview url={data.interviewLink} />
        <InviteDrawer
          editMode
          execute={execute}
          customButton={onClick => (
            <Tooltip title="Edit Live Interview">
              <EditOutlined onClick={() => onClick(data._id)} />
            </Tooltip>
          )}
        />
        <InviteDrawer
          data={data}
          customButton={onClick => (
            <Tooltip title="Add candidate documents that will be visible during the interview">
              <FileAddOutlined onClick={onClick} />
            </Tooltip>
          )}
        />
        <Popconfirm
          title="Are you sure you want to delete this interview?"
          onConfirm={() => confirmDelete(data._id)}
          okText="Yes"
          cancelText="No"
          placement="topRight"
        >
          <Tooltip title="Delete Live Interview">
            <DeleteOutlined />
          </Tooltip>
        </Popconfirm>
      </Space>
    );
  };

  return (
    <>
      <AntPageHeader
        title="Live Interviews"
        subTitle="Schedule and view live two-way interviews"
        onBack={null}
        footer={
          <Tabs
            onChange={tabKey => {
              router.push(`/live-interviews/?tab=${tabKey}&page=${page}`);
              setActiveTab(tabKey);
            }}
            defaultActiveKey={activeTab}
          >
            <Tabs.TabPane tab="Upcoming" key="1" />
            <Tabs.TabPane tab="Completed" key="2" />
          </Tabs>
        }
      />
      <ConfigProvider
        renderEmpty={() =>
          customEmpty(
            'No Live Interviews Scheduled',
            null,
            null,
            <InviteDrawer execute={execute} />
          )
        }
      >
        <Card>
          <TableToolbar
            extra={<InviteDrawer execute={execute} />}
            reload={() => setReload(flag => !flag)}
          />
          <Spin spinning={false}>
            {/* <Table columns={columns} dataSource={upcomingInterviews} pagination={false} /> */}
            <StandardTable
              onChange={handleChange}
              selectedRows={null}
              loading={pending}
              data={{ list: activeTab === '1' ? upcomingInterviews : pastInterviews }}
              // size="small"
              columns={columns}
              pagination={{
                defaultCurrent: Number(page),
                // current: page,
                onChange: page => {
                  router.push(`/live-interviews/?tab=${tab}&page=${page}`);
                },
              }}
            />
          </Spin>
          {/* <TabPane tab="Completed Live Interviews" key="2">
                <Spin spinning={false}>
                  <StandardTable
                    selectedRows={null}
                    loading={pending}
                    data={{ list: pastInterviews }}
                    columns={columns}
                  />
                </Spin>
              </TabPane> */}
        </Card>
      </ConfigProvider>
    </>
  );

  // <Title level={4}>
  //   <div>Coming soon...</div>
  //   <Button
  //     size="large"
  //     type="primary"
  //     onClick={() => window.open('https://russellratcliffe.typeform.com/to/KkTSNU', '_blank')}
  //   >
  //     Join Waitlist
  //   </Button>
  // </Title>

  // <Empty
  //   image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
  //   description="Live interviews coming soon..."
  // >
  //   <Button
  //     onClick={() => {
  //       window.open('https://russellratcliffe.typeform.com/to/KkTSNU', '_blank');
  //     }}
  //     type="primary"
  //   >
  //     Join Waitlist
  //   </Button>
  // </Empty>
};

export default LiveInterviews;
