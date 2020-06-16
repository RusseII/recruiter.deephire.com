import React, { useEffect, useState } from 'react';
import { WaterWave } from 'ant-design-pro/lib/Charts';
import { Card, Row, Col, Statistic, Tag, ConfigProvider, PageHeader } from 'antd';

import readableTime from 'readable-timestamp';
import router from 'umi/router';
import StandardTable from '@/components/StandardTable';
import customEmpty from '@/components/CustomEmpty';

import { useAsync } from '@/services/hooks';
import { lowerCaseQueryParams } from '@/utils/utils';

import { getEventbyId } from '@/services/api';
import 'antd/dist/antd.css';
import 'ant-design-pro/dist/ant-design-pro.css';

// const getWidth = () => Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

const CandidateAnalytics = () => {
  const { id: interviewId } = lowerCaseQueryParams(window.location.search);

  const [analytics, setAnalytics] = useState({ invited: 0, clicked: 0, started: 0, completed: 0 });

  const filterData = async id => {
    const data = await getEventbyId(id);
    const { events } = data;
    if (!events || events.length === 0) return { events: [] };

    const reduced = events.reduce(
      (result, item) => {
        // eslint-disable-next-line no-param-reassign
        result[item.event][item.candidateEmail] = item;
        return result;
      },
      { started: {}, clicked: {}, invited: {}, completed: {} }
    );
    // console.log('Cureduced.length);
    const { invited, clicked, started, completed } = reduced;
    const filteredData = { ...invited, ...clicked, ...started, ...completed };
    const simplifiedData = Object.keys(filteredData).map(key => filteredData[key]);
    setAnalytics({
      invited: Object.keys(invited).length,
      clicked: Object.keys(clicked).length,
      started: Object.keys(started).length,
      completed: Object.keys(completed).length,
    });
    const filteredSimplifiedData = simplifiedData.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    return { events: filteredSimplifiedData };
  };

  const { execute, pending, value } = useAsync(filterData, false);

  const { events = [] } = value || {};
  useEffect(() => {
    execute(interviewId);
  }, [interviewId]);
  const columns = [
    {
      title: 'Name',
      dataIndex: 'userName',
      key: 'name',
    },
    {
      title: 'Candidate Email',
      key: 'candidateEmail',
      dataIndex: 'candidateEmail',
    },
    {
      title: 'Candidate Status',
      dataIndex: 'event',
      key: 'event',
      render: event => {
        let color;
        if (event === 'invited') color = 'purple';
        if (event === 'clicked') color = 'yellow';
        if (event === 'started') color = 'orange';
        if (event === 'completed') color = 'green';

        return <Tag color={color}>{event}</Tag>;
      },
    },
    {
      title: 'Last Event Time',
      dataIndex: 'timestamp',
      render: timestamp => {
        const dateObj = new Date(timestamp);
        const displayTime = readableTime(dateObj);
        return displayTime;
      },
    },
  ];

  const length = events.length ? events.length : 1;
  const percent = Math.floor((analytics.completed / length) * 100);
  return (
    <>
      <PageHeader
        style={{ width: 'calc(100% + 100px)', marginTop: -22, marginBottom: 24, marginLeft: -24 }}
        onBack={() => router.goBack()}
        title="Interview Analytics"
        ghost={false}
        subTitle="View completion rates & invited candidates"
      />
      {/* <Row> </Row> */}
      {!pending && (
        <Row gutter={[24, 24]}>
          <>
            <Col span={8}>
              <Card title="Candidate Completion Rate">
                <div style={{ textAlign: 'center' }}>
                  <WaterWave height={161} title="Completed" percent={percent} />
                </div>
              </Card>
            </Col>
            <Col span={16}>
              <Card>
                <Row style={{ textAlign: 'center' }}>
                  <Col span={6}>
                    <Statistic title={<div>Total Invited</div>} value={analytics.invited} />
                  </Col>

                  <Col span={6}>
                    <Statistic title="Total Clicked" value={analytics.clicked} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="Total Started" value={analytics.started} />
                  </Col>

                  <Col span={6}>
                    <Statistic title="Total Completed" value={analytics.completed} />
                  </Col>
                </Row>
              </Card>
            </Col>
          </>
        </Row>
      )}

      <ConfigProvider renderEmpty={() => customEmpty('No Candidates Have Been Invited')}>
        <StandardTable
          selectedRows={null}
          loading={pending}
          data={{ list: events }}
          columns={columns}
          pagination={false}
        />
      </ConfigProvider>
    </>
  );
};

export default CandidateAnalytics;
