/* eslint-disable camelcase */
import React, { useState, useContext, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  Tabs,
  Spin,
  Popover,
  Tooltip,
  Empty,
  Tag,
  Space,
  ConfigProvider,
} from 'antd';
import router from 'umi/router';
import { ShareAltOutlined, FileAddOutlined, VideoCameraOutlined } from '@ant-design/icons';
import InviteDrawer from './ScheduleInterview';
import { getLiveInterviews } from '@/services/api';
import GlobalContext from '@/layouts/MenuContext';
import { lowerCaseQueryParams, handleFilter } from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import TableToolbar from '@/components/StandardTable/TableToolbar';
import { useSearch, useAsync } from '@/services/hooks';

import customEmpty from '@/components/CustomEmpty';

import AntPageHeader from '@/components/PageHeader/AntPageHeader';

const { Text } = Typography;

const Actions = ({ data }) => {
  const { interviewLink } = data;
  const [visibility, setVisibility] = useState({ hovered: false, clicked: false });

  // const { recordings } = data;
  // let lastestRecording;
  // if (recordings) {
  //   [lastestRecording] = recordings.slice(-1);
  // }

  return (
    <Space>
      <Tooltip title="Join the interview">
        <VideoCameraOutlined onClick={() => window.open(interviewLink, '_blank')} />
      </Tooltip>
      <Tooltip
        title="Share with candidate"
        trigger="hover"
        visible={visibility.hovered}
        onVisibleChange={visible => setVisibility({ hovered: visible, clicked: false })}
      >
        <Popover
          title="Share this link with your candidate"
          content={<Text copyable>{data.interviewLink}</Text>}
          trigger="click"
          visible={visibility.clicked}
          onVisibleChange={visible => setVisibility({ hovered: false, clicked: visible })}
        >
          <ShareAltOutlined />
        </Popover>
      </Tooltip>
      <InviteDrawer
        data={data}
        customButton={onClick => (
          <Tooltip title="Add candidate documents that will be visible during the interview">
            <FileAddOutlined onClick={onClick} />
          </Tooltip>
        )}
      />
    </Space>
  );
};

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

  const fetchLiveInterviews = async () => {
    const live = await getLiveInterviews();
    if (live) {
      const liveOrdered = live.sort((a, b) => {
        return new Date(b.interviewTime[0]) - new Date(a.interviewTime[0]);
      });
      return liveOrdered;
    }
    return live;
  };

  const { execute, pending, value } = useAsync(fetchLiveInterviews, false);

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
    execute();
  }, [reload]);

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
  useEffect(() => {
    if (value) setLiveInterviews(value);
  }, [value]);

  const columns = [
    {
      title: 'Interview Time',
      dataIndex: 'interviewTime',
      key: 'interviewTime',
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
      title: 'Interviewer',
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
    activeTab !== '1'
      ? {
          title: 'Recording',
          key: 'recording',
          fixed: 'right',
          // width: 50,

          render: (text, data) => {
            const { recordingStatus, _id } = data;
            if (recordingStatus === 'composition-available') {
              return (
                <a
                  type="link"
                  onClick={() => router.push(`/one-way/candidates/candidate/?liveid=${_id}`)}
                >
                  View Recording
                </a>
              );
            }
            if (recordingStatus === 'composition-progress') {
              return 'Proccessing...';
            }
            return null;
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
            return <Actions data={data} />;
          },
        }
      : null,
  ].filter(item => item !== null);

  const { email } = recruiterProfile || {};
  if (
    email &&
    (email === 'demo@deephire.com' ||
      email.includes('deephire.com') ||
      email.includes('assistinghands') ||
      email.includes('russell') ||
      email.includes('apple') ||
      email.includes('rratcliffe57@gmail.com') ||
      email.includes('klingcare'))
  ) {
    const upcomingInterviewsFiltered = liveInterviews.filter(liveInterview => {
      return new Date(liveInterview.interviewTime[1]) > new Date();
    });
    const upcomingInterviews = upcomingInterviewsFiltered.sort((a, b) => {
      return new Date(a.interviewTime[0]) - new Date(b.interviewTime[0]);
    });

    const pastInterviews = liveInterviews.filter(liveInterview => {
      return new Date(liveInterview.interviewTime[1]) < new Date();
    });

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
  }

  return (
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

    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      description="Live interviews coming soon..."
    >
      <Button
        onClick={() => {
          window.open('https://russellratcliffe.typeform.com/to/KkTSNU', '_blank');
        }}
        type="primary"
      >
        Join Waitlist
      </Button>
    </Empty>
  );
};

export default LiveInterviews;
