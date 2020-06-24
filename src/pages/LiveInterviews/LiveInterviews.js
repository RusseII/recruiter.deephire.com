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
  Row,
  Col,
  Space,
  ConfigProvider,
} from 'antd';
import router from 'umi/router';
import { ShareAltOutlined, FileAddOutlined } from '@ant-design/icons';
import InviteDrawer from './ScheduleInterview';
import { getLiveInterviews } from '@/services/api';
import GlobalContext from '@/layouts/MenuContext';
import { lowerCaseQueryParams } from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import { useAsync } from '@/services/hooks';
import customEmpty from '@/components/CustomEmpty';

import AntPageHeader from '@/components/PageHeader/AntPageHeader';

const { Text } = Typography;

const Actions = ({ data }) => {
  const [visibility, setVisibility] = useState({ hovered: false, clicked: false });

  // const { recordings } = data;
  // let lastestRecording;
  // if (recordings) {
  //   [lastestRecording] = recordings.slice(-1);
  // }

  return (
    <Space>
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
          <Button shape="circle" icon={<ShareAltOutlined />} />
        </Popover>
      </Tooltip>
      <InviteDrawer
        data={data}
        customButton={onClick => (
          <Tooltip title="Add candidate documents that will be visible during the interview">
            <Button onClick={onClick} shape="circle" icon={<FileAddOutlined />} />
          </Tooltip>
        )}
      />
    </Space>
  );
};

const LiveInterviews = () => {
  const { tab = 1, page = 1 } = lowerCaseQueryParams(window.location.search);

  const [activeTab, setActiveTab] = useState(tab || '1');

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
  const team = recruiterProfile?.app_metadata?.team;

  let liveInterViewTeamFilter = liveInterviews;

  if (team) {
    liveInterViewTeamFilter = liveInterviews.filter(liveInterview => {
      if (!liveInterview.createdByTeam) return null;
      return liveInterview.createdByTeam.includes(team);
    });
  }

  useEffect(() => {
    execute();
  }, []);

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
    },
    {
      title: 'Candidate Email',
      dataIndex: 'candidateEmail',
      key: 'candidateEmail',
    },
    activeTab !== '1'
      ? {
          title: 'Recording',
          key: 'recording',
          fixed: 'right',

          width: 0,
          render: (text, data) => {
            const { recordingStatus, _id } = data;
            if (recordingStatus === 'composition-available') {
              return (
                <Button
                  type="link"
                  onClick={() => router.push(`/candidates/view-candidate/?liveid=${_id}`)}
                >
                  View Recording
                </Button>
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
          fixed: activeTab === '1' ? 'right' : false,
          render: (text, data) => {
            const { interviewTime, interviewLink } = data;
            const [, end] = interviewTime;

            return new Date(end) > new Date() ? (
              <Row gutter={[8, 8]}>
                <Col>
                  <Button type="primary" ghost href={interviewLink} target="_blank">
                    Join
                  </Button>
                </Col>
                <Col>
                  <Actions data={data} />
                </Col>
              </Row>
            ) : null;
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
    const upcomingInterviewsFiltered = liveInterViewTeamFilter.filter(liveInterview => {
      return new Date(liveInterview.interviewTime[1]) > new Date();
    });
    const upcomingInterviews = upcomingInterviewsFiltered.sort((a, b) => {
      return new Date(a.interviewTime[0]) - new Date(b.interviewTime[0]);
    });

    const pastInterviews = liveInterViewTeamFilter.filter(liveInterview => {
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
              tabBarExtraContent={<InviteDrawer execute={execute} />}
            >
              <Tabs.TabPane tab="Upcoming Live Interviews" key="1" />
              <Tabs.TabPane tab="Completed Live Interviews" key="2" />
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
            <Spin spinning={false}>
              {/* <Table columns={columns} dataSource={upcomingInterviews} pagination={false} /> */}
              <StandardTable
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
