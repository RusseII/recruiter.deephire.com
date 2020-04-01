import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Typography, Button, Tabs, Spin, Popover, Tooltip } from 'antd';
import router from 'umi/router';
import { ShareAltOutlined } from '@ant-design/icons';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import InviteDrawer from './ScheduleInterview';
import { getLiveInterviews } from '@/services/api';
import GlobalContext from '@/layouts/MenuContext';

const { TabPane } = Tabs;
const { Text, Title } = Typography;
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
    dataIndex: 'createdBy',
    key: 'createdBy',
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
  {
    title: 'Recording Status',
    key: 'recording',
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
  },
  {
    title: '',
    key: 'action',
    render: (text, data) => {
      const { interviewTime, interviewLink } = data;
      const [, end] = interviewTime;

      return new Date(end) > new Date() ? (
        <>
          <Button type="link" href={interviewLink} target="_blank">
            Join Interview
          </Button>
          <Actions data={data} />
        </>
      ) : null;
    },
  },
];

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
      {/* <Tooltip title="Download Interview Recording">
        <Button
          href={lastestRecording}
          target="_blank"
          style={{ marginLeft: 8 }}
          shape="circle"
          icon={<ShareAltOutlined />}
        />
      </Tooltip> */}
    </>
  );
};

const LiveInterviews = () => {
  const [liveInterviews, setLiveInterviews] = useState([]);
  const [reload, setReload] = useState(false);
  const globalData = useContext(GlobalContext);

  const { recruiterProfile } = globalData;

  useEffect(() => {
    const setInterviews = async () => {
      const live = await getLiveInterviews();
      const liveOrdered = live.sort((a, b) => {
        return new Date(a.interviewTime[0]) - new Date(b.interviewTime[0]);
      });
      setLiveInterviews(liveOrdered);
    };
    setInterviews();
  }, [reload]);

  if (recruiterProfile?.email !== 'demo@deephire.com') {
    return (
      <Title style={{ textAlign: 'center', verticalAlign: 'center', lineHeight: 10 }}>
        Coming soon...
      </Title>
    );
  }
  const upcomingInterviews = liveInterviews.filter(liveInterview => {
    return new Date(liveInterview.interviewTime[1]) > new Date();
  });

  const pastInterviews = liveInterviews.filter(liveInterview => {
    return new Date(liveInterview.interviewTime[1]) < new Date();
  });

  return (
    <PageHeaderWrapper title="Live Interview">
      <Card>
        <Tabs tabBarExtraContent={<InviteDrawer setReload={setReload} />} defaultActiveKey="1">
          <TabPane tab="Upcoming Live Interviews" key="1">
            <Spin spinning={false}>
              <Table columns={columns} dataSource={upcomingInterviews} pagination={false} />
            </Spin>
          </TabPane>
          <TabPane tab="Completed Live Interviews" key="2">
            <Spin spinning={false}>
              <Table columns={columns} dataSource={pastInterviews} />
            </Spin>
          </TabPane>
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  );
};

export default LiveInterviews;
