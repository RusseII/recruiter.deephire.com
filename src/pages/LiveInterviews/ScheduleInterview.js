import React, { useState } from 'react';
import { Result, Drawer, Form, Button, Col, Row, Input, DatePicker } from 'antd';
import { ScheduleOutlined } from '@ant-design/icons';
import moment from 'moment';
import DirectLink from '@/components/InviteCandidates/DirectLink';
import { scheduleInterview } from '@/services/api';

const { RangePicker } = DatePicker;

const ScheduleButton = ({ execute }) => {
  const [visible, setVisible] = useState(false);
  const [interviewScheduled, setInterviewScheduled] = useState(false);
  const [linkToInterview, setLinkToInterview] = useState('loading...');
  const onFinish = async values => {
    const interviewData = await scheduleInterview(values, 'Interview succesfully scheduled');
    const { interviewLink } = interviewData;
    setLinkToInterview(interviewLink);
    setInterviewScheduled(true);
    execute();
  };

  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
  }

  return (
    <div>
      <Button
        type="primary"
        ghost
        onClick={() => setVisible(true)}
        style={{ marginBottom: 12 }}
        icon={<ScheduleOutlined />}
      >
        Schedule Interview
      </Button>
      <Drawer
        width={window.innerWidth > 720 ? 378 : null}
        title="Schedule Interview"
        drawerStyle={{ backgroundColor: '#f0f2f5', overflowY: 'scroll' }}
        // width={600}
        onClose={() => {
          setVisible(false);
          setInterviewScheduled(false);
        }}
        visible={visible}
      >
        {interviewScheduled ? (
          <Result
            style={{ padding: 0 }}
            status="success"
            title="Successfully Scheduled"
            subTitle="Please share the below link with the candidate, and use that link to join the interview when it is your interview time."
            extra={[
              <DirectLink link={linkToInterview} />,
              // <Button>Schedule another</Button>,
            ]}
          />
        ) : (
          <Form layout="vertical" onFinish={onFinish} hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="candidateName"
                  label="Candidate Name"
                  rules={[{ required: true, message: 'Please enter candidate name' }]}
                >
                  <Input placeholder="Candidate name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="candidateEmail"
                  label="Candidate Email"
                  rules={[
                    { required: true, message: 'Please enter candidate email' },
                    { type: 'email', message: 'The input is not valid E-mail!' },
                  ]}
                >
                  <Input placeholder="Candidate email" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="interviewTime"
                  label="Interview Time"
                  rules={[{ required: true, message: 'Please choose the Interview Time' }]}
                >
                  <RangePicker
                    style={{ width: '100%' }}
                    showTime={{
                      minuteStep: 15,
                      hideDisabledOptions: true,
                      use12Hours: true,
                      format: 'h:mm a',
                    }}
                    format="MM-DD h:mm a"
                    onChange={() => {}}
                    onOk={() => {}}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Button htmlType="submit" type="primary" style={{ marginTop: 24, width: '100%' }}>
              Schedule Interview
            </Button>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default ScheduleButton;
