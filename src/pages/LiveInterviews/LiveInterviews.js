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
} from 'antd';
import router from 'umi/router';
import { ShareAltOutlined, FileAddOutlined } from '@ant-design/icons';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import InviteDrawer from './ScheduleInterview';
import { getLiveInterviews } from '@/services/api';
import GlobalContext from '@/layouts/MenuContext';
import { lowerCaseQueryParams } from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import { useAsync } from '@/services/hooks';

const { TabPane } = Tabs;
const { Text } = Typography;

const Actions = ({ data }) => {
  const { interviewType } = data;
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
      {interviewType === 'client' && (
        <InviteDrawer
          data={data}
          customButton={onClick => (
            <Tooltip title="Add candiate documents that will be visible during the interview">
              <Button onClick={onClick} shape="circle" icon={<FileAddOutlined />} />
            </Tooltip>
          )}
        />
      )}
    </Space>
  );
};

const LiveInterviews = () => {
  const { tab } = lowerCaseQueryParams(window.location.search);

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
  let liveInterviews = value || [];

  const { recruiterProfile } = globalData;
  // eslint-disable-next-line camelcase
  const team = recruiterProfile?.app_metadata?.team;

  if (team) {
    liveInterviews = liveInterviews.filter(liveInterview => {
      if (!liveInterview.createdByTeam) return null;
      return liveInterview.createdByTeam.includes(team);
    });
  }

  useEffect(() => {
    execute();
  }, []);

  const columns = [
    {
      title: 'Interview Time',
      dataIndex: 'interviewTime',
      key: 'interviewTime',
      render: startEndTime => {
        const [start, end] = startEndTime;
        const startDateObj = new Date(start);
        const endDateObj = new Date(end);

        const startDate = startDateObj.toLocaleString('default', {
          month: 'long',
          weekday: 'long',
          day: 'numeric',
        });
        const startTime = startDateObj.toLocaleString('default', {
          hour: 'numeric',
          minute: 'numeric',
        });

        const endTime = endDateObj.toLocaleString('default', {
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
      email === 'russell@deephire.com' ||
      email.includes('assistinghands') ||
      email.includes('russell') ||
      email.includes('apple') ||
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
      <PageHeaderWrapper title="Live Interview">
        <Card>
          <Tabs
            tabBarExtraContent={<InviteDrawer execute={execute} />}
            activeKey={activeTab}
            onChange={tabKey => setActiveTab(tabKey)}
          >
            <TabPane tab="Upcoming Live Interviews" key="1">
              <Spin spinning={false}>
                {/* <Table columns={columns} dataSource={upcomingInterviews} pagination={false} /> */}
                <StandardTable
                  selectedRows={null}
                  loading={pending}
                  data={{ list: upcomingInterviews }}
                  // size="small"
                  columns={columns}
                  pagination={false}
                />
              </Spin>
            </TabPane>
            <TabPane tab="Completed Live Interviews" key="2">
              <Spin spinning={false}>
                {/* <Table columns={columns} dataSource={pastInterviews} /> */}
                <StandardTable
                  selectedRows={null}
                  loading={pending}
                  data={{ list: pastInterviews }}
                  // size="small"
                  columns={columns}
                />
              </Spin>
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
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
