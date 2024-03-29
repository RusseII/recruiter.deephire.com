import React, { useState } from 'react';
import { WaterWave } from 'ant-design-pro/lib/Charts';
import { Card, Row, Col, Statistic, Tooltip, DatePicker, Button } from 'antd';

import { InfoCircleOutlined } from '@ant-design/icons';
import AntPageHeader from '@/components/PageHeader/AntPageHeader';

import 'antd/dist/antd.css';
import 'ant-design-pro/dist/ant-design-pro.css';

// eslint-disable-next-line import/no-unresolved
import { useRecruiter, useSummary } from '../services/apiHooks';
import { downloadFile } from '../services/api';

const { RangePicker } = DatePicker;

// const getWidth = () => Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

const Analytics = () => {
  // const [analytics, setAnalytics] = useState({ invited: 0, clicked: 0, started: 0, completed: 0, set: false });
  const [startDate, setStartDate] = useState(0);
  const [endDate, setEndDate] = useState(Date.now());

  const { data: analytics } = useSummary(startDate, endDate);

  const { data: profile } = useRecruiter();

  const percent = analytics?.completionRate ? Math.round(analytics.completionRate * 100) : 0;

  const onDateChange = dates => {
    const newStartTime = new Date(dates[0]);
    const newEndTime = new Date(dates[1]);
    setStartDate(newStartTime.getTime());
    setEndDate(newEndTime.getTime());
  };

  const downloadUsers = () => {
    // eslint-disable-next-line camelcase
    if (profile?.app_metadata?.companyId) {
      downloadFile(profile.app_metadata.companyId, 'users.csv', startDate, endDate);
    }
  };

  const downloadJobs = () => {
    // eslint-disable-next-line camelcase
    if (profile?.app_metadata?.companyId) {
      downloadFile(profile.app_metadata.companyId, 'jobs.csv', startDate, endDate);
    }
  };

  const downloadCandidates = () => {
    // eslint-disable-next-line camelcase
    if (profile?.app_metadata?.companyId) {
      downloadFile(profile.app_metadata.companyId, 'candidates.csv', startDate, endDate);
    }
  };

  const downloadBranch = () => {
    // eslint-disable-next-line camelcase
    if (profile?.app_metadata?.companyId) {
      downloadFile(profile.app_metadata.companyId, 'branch.csv', startDate, endDate);
    }
  };

  const downloadClient = () => {
    // eslint-disable-next-line camelcase
    if (profile?.app_metadata?.companyId) {
      downloadFile(profile.app_metadata.companyId, 'client.csv', startDate, endDate);
    }
  };

  return (
    <>
      <AntPageHeader title="Analytics" subTitle="View completion rates." />
      <RangePicker onChange={onDateChange} style={{ marginBottom: 8 }} />
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
                    value={analytics?.invited}
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
                    value={analytics?.clicked}
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
                    value={analytics?.started}
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
                    value={analytics?.completed}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </>
      </Row>
      <Row>
        <Col>
          <Button style={{ marginRight: 8 }} onClick={() => downloadUsers()}>
            Download User Worksheet
          </Button>
        </Col>
        <Col>
          <Button style={{ marginRight: 8 }} onClick={() => downloadJobs()}>
            Download Jobs Worksheet
          </Button>
        </Col>
        <Col>
          <Button style={{ marginRight: 8 }} onClick={() => downloadCandidates()}>
            Download Candidates Worksheet
          </Button>
        </Col>
        <Col>
          <Button style={{ marginRight: 8 }} onClick={() => downloadBranch()}>
            Download Branch Worksheet
          </Button>
        </Col>
        <Col>
          <Button style={{ marginRight: 8 }} onClick={() => downloadClient()}>
            Download Client Worksheet
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Analytics;
