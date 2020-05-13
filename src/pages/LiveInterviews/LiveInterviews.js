import React, { useState, useContext, useEffect } from 'react';
import { Card, Typography, Button, Tabs, Spin, Popover, Tooltip, Empty, Row, Col } from 'antd';
import router from 'umi/router';
import { ShareAltOutlined } from '@ant-design/icons';
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
  const [visibility, setVisibility] = useState({ hovered: false, clicked: false });

  // const { recordings } = data;
  // let lastestRecording;
  // if (recordings) {
  //   [lastestRecording] = recordings.slice(-1);
  // }

  return (
    <>
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
    </>
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
  const liveInterviews = value || [];
  const { recruiterProfile } = globalData;

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
          hour: 'numeric',
          minute: 'numeric',
        });

        const endDate = endDateObj.toLocaleString('default', {
          hour: 'numeric',
          minute: 'numeric',
        });
        return `${startDate}-${endDate}`;
      },
    },
    {
      title: 'Interviewer',
      key: 'createdBy',
      render: data => {
        const { createdBy, recruiterName } = data;
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
      email.includes('klingcare'))
  ) {
    const upcomingInterviews = liveInterviews.filter(liveInterview => {
      return new Date(liveInterview.interviewTime[1]) > new Date();
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