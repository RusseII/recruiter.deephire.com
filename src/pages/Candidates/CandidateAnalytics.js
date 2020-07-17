import React, { useEffect, useState } from 'react';
import { WaterWave } from 'ant-design-pro/lib/Charts';
import { Card, Row, Col, Statistic, ConfigProvider, Tooltip, Badge } from 'antd';

import readableTime from 'readable-timestamp';
import { InfoCircleOutlined } from '@ant-design/icons';
import { lowerCaseQueryParams, handleFilter } from '@bit/russeii.deephire.utils.utils';
import AntPageHeader from '@/components/PageHeader/AntPageHeader';
import StandardTable from '@/components/StandardTable';
import customEmpty from '@/components/CustomEmpty';

import { useSearch } from '@/services/complexHooks';
import { useAsync } from '@/services/hooks';

import { getEventbyId } from '@/services/api';
import 'antd/dist/antd.css';
import 'ant-design-pro/dist/ant-design-pro.css';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// const getWidth = () => Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

const CandidateAnalytics = () => {
  const getColumnSearchProps = useSearch();

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
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      ...getColumnSearchProps('userName', 'Name'),
    },
    {
      title: 'Candidate Email',
      key: 'candidateEmail',
      dataIndex: 'candidateEmail',
      sorter: (a, b) => a.candidateEmail.localeCompare(b.candidateEmail),
      ...getColumnSearchProps('candidateEmail', 'Candidate Email'),
    },
    {
      title: 'Candidate Status',
      dataIndex: 'event',
      key: 'event',
      ...handleFilter(events, 'event'),
      sorter: (a, b) => a.event.localeCompare(b.event),
      render: event => {
        let status;
        if (event === 'invited') status = 'default';
        if (event === 'clicked') status = 'warning';
        if (event === 'started') status = 'processing';
        if (event === 'completed') status = 'success';

        return (
          <>
            <Badge status={status} text={capitalizeFirstLetter(event)} />
          </>
        );
      },
    },
    {
      title: 'Last Event Time',
      dataIndex: 'timestamp',
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
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
      <AntPageHeader title="Job Analytics" subTitle="View completion rates & invited candidates" />
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
                    <Statistic
                      title={
                        <div>
                          Total Invited
                          <Tooltip title="The number of candidates who were invited to an interview through automated invites">
                            <InfoCircleOutlined style={{ marginLeft: 8 }} />
                          </Tooltip>
                        </div>
                      }
                      value={analytics.invited}
                    />
                  </Col>

                  <Col span={6}>
                    <Statistic
                      title={
                        <div>
                          Total Clicked
                          <Tooltip title="The number of candidates who clicked on the interview link">
                            <InfoCircleOutlined style={{ marginLeft: 8 }} />
                          </Tooltip>
                        </div>
                      }
                      value={analytics.clicked}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title={
                        <div>
                          Total Started
                          <Tooltip title="The number of candidates who started an interview">
                            <InfoCircleOutlined style={{ marginLeft: 8 }} />
                          </Tooltip>
                        </div>
                      }
                      value={analytics.started}
                    />
                  </Col>

                  <Col span={6}>
                    <Statistic
                      title={
                        <div>
                          Total Completed
                          <Tooltip title="The number of candidates who submitted a completed interview">
                            <InfoCircleOutlined style={{ marginLeft: 8 }} />
                          </Tooltip>
                        </div>
                      }
                      value={analytics.completed}
                    />
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
