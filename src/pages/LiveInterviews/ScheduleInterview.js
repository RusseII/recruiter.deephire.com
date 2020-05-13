import React, { useState, useEffect } from 'react';
import { Result, Drawer, Form, Button, Col, Row, Input, DatePicker, Select } from 'antd';
import { ScheduleOutlined } from '@ant-design/icons';
import moment from 'moment';
import DirectLink from '@/components/InviteCandidates/DirectLink';
import { scheduleInterview } from '@/services/api';
import CandidateDataCard from '@/components/Candidate/CandidateDataCard';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ScheduleButton = ({ execute, data, customButton }) => {
  const { candidateEmail, candidateName } = data || {};
  const [values, setValues] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('recruiter');
  const [scheduleProgress, setScheduleProgress] = useState('started');
  const [linkToInterview, setLinkToInterview] = useState('loading...');
  const onFinish = async values => {
    const { interviewType } = values;
    setLoading(true);
    const interviewData = await scheduleInterview(values, 'Interview succesfully scheduled');
    setLoading(false);
    const { interviewLink } = interviewData;
    setLinkToInterview(interviewLink);
    const nextStep = interviewType === 'client' ? 'documents' : 'finished';
    setValues(values);
    setScheduleProgress(nextStep);
    execute();
  };

  useEffect(() => {
    if (data) {
      const { interviewLink } = data;
      setScheduleProgress('documents');
      setLinkToInterview(interviewLink);
    }
  }, [visible]);

  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
  }

  const Documents = props => (
    <>
      <div style={{ marginBottom: 8 }}>Add Candidate Documents</div>
      <CandidateDataCard {...props} />

      <Button
        type="primary"
        onClick={() => setScheduleProgress('finished')}
        style={{ marginTop: 24, width: '100%' }}
      >
        Finish Adding Documents
      </Button>
    </>
  );

  return (
    <div>
      {(customButton && customButton(() => setVisible(true))) || (
        <Button
          type="primary"
          ghost
          onClick={() => setVisible(true)}
          style={{ marginBottom: 12 }}
          icon={<ScheduleOutlined />}
        >
          Schedule Interview
        </Button>
      )}
      <Drawer
        width={window.innerWidth > 720 ? 378 : null}
        title="Schedule Interview"
        drawerStyle={{ backgroundColor: '#f0f2f5', overflowY: 'scroll' }}
        // width={600}
        onClose={() => {
          setVisible(false);
          setScheduleProgress('started');
        }}
        visible={visible}
      >
        {scheduleProgress === 'finished' && (
          <Result
            style={{ padding: 0 }}
            status="success"
            title={data ? 'Succesfully Updated' : 'Successfully Scheduled'}
            subTitle="Please share the below link with the candidate, and use that link to join the interview when it is your interview time."
            extra={[
              <DirectLink link={linkToInterview} />,
              // <Button>Schedule another</Button>,
            ]}
          />
        )}

        {scheduleProgress === 'documents' && (
          <Documents
            editable
            email={candidateEmail || values.candidateEmail}
            userName={candidateName || values.candidateName}
          />
        )}

        {scheduleProgress === 'started' && (
          <Form layout="vertical" onFinish={onFinish} hideRequiredMark>
            <Form.Item
              initialValue="recruiter"
              name="interviewType"
              label="Interview Type"
              rules={[{ required: true }]}
            >
              <Select defaultValue="recruiter" onChange={type => setType(type)}>
                <Option value="recruiter">You + Candidate</Option>
                <Option value="client">Client + Candidate</Option>
              </Select>
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="candidateName"
                  label="Candidate Name"
                  rules={[{ required: true, message: `Please enter candidate name` }]}
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
            {type === 'client' && <ClientInfo />}

            <Button
              loading={loading}
              htmlType="submit"
              type="primary"
              style={{ marginTop: 8, width: '100%' }}
            >
              Schedule Interview
            </Button>
            <div style={{ marginTop: 8 }}>
              {`A calendar invite will be sent to ${
                type === 'client' ? 'your client' : 'you'
              } and the candidate`}
            </div>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

const ClientInfo = () => (
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item
        name="clientName"
        label="Client Name"
        rules={[{ required: true, message: `Please enter client name` }]}
      >
        <Input placeholder="Client name" />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item
        name="clientEmail"
        label="Client Email"
        rules={[
          { required: true, message: `Please enter client email` },
          { type: 'email', message: 'The input is not valid E-mail!' },
        ]}
      >
        <Input placeholder="Client email" />
      </Form.Item>
    </Col>
  </Row>
);

export default ScheduleButton;
