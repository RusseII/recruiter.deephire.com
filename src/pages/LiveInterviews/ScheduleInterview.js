import React, { useState, useEffect, useContext } from 'react';
import {
  Result,
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  Switch,
  Collapse,
  DatePicker,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import moment from 'moment';
import { ShareInterviewContent } from '@/components/ShareInterview';
import { scheduleInterview, getCandidateProfile, removeCandidateDocument } from '@/services/api';
import { useLiveTemplates } from '@/services/apiHooks';

import CandidateDataCard from '@/components/Candidate/DataCard';
import GlobalContext from '@/layouts/MenuContext';
import SchedulePicker from './SchedulePicker';
import 'react-quill/dist/quill.snow.css';

const { Panel } = Collapse;

const { Option } = Select;

const customPanelStyle = {
  backgroundColor: '#f0f2f5',
  border: 'none',
};

function disabledDate(current) {
  const tooEarly = current && current < moment().startOf('day');

  return tooEarly;
}

const calendarProps = {
  showTime: {
    minuteStep: 15,
    hideDisabledOptions: true,
    use12Hours: true,
    format: 'h:mm a',
  },
  format: 'MM-DD h:mm a',
};
const ScheduleButton = ({ execute, data, customButton }) => {
  const globalData = useContext(GlobalContext);
  const { recruiterProfile } = globalData;
  // eslint-disable-next-line camelcase
  const createdByTeam = recruiterProfile?.app_metadata?.team;

  const { candidateEmail, candidateName, jobName } = data || {};
  const [values, setValues] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('recruiter');
  const [scheduleProgress, setScheduleProgress] = useState('started');
  const [linkToInterview, setLinkToInterview] = useState('loading...');

  const onFinish = async values => {
    // TODO auto load the tempaltes here?
    if (values.recording === undefined) {
      // since the recording button it only rendered when expanded
      // this makes the default value recording = true
      // eslint-disable-next-line no-param-reassign
      values.recording = true;
    }

    setLoading(true);
    const interviewData = await scheduleInterview(
      { ...values, createdByTeam },
      'Interview succesfully scheduled'
    );
    setLoading(false);
    const { interviewLink } = interviewData;
    setLinkToInterview(interviewLink);
    const nextStep = 'documents';
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

  const Documents = props => (
    <>
      <div style={{ marginBottom: 8 }}>Add Candidate Documents</div>
      <CandidateDataCard
        getCandidateProfile={getCandidateProfile}
        removeCandidateDocument={removeCandidateDocument}
        {...props}
      />

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
        <Button type="primary" onClick={() => setVisible(true)} icon={<PlusOutlined />}>
          Schedule Interview
        </Button>
      )}
      <Drawer
        width={window.innerWidth > 720 ? 430 : null}
        title="Schedule Interview"
        drawerStyle={{ backgroundColor: '#f0f2f5', overflowY: 'scroll' }}
        onClose={() => {
          setVisible(false);
          setScheduleProgress('started');
        }}
        visible={visible}
      >
        {scheduleProgress === 'finished' && (
          <>
            <Result
              style={{ padding: 0, marginBottom: 24 }}
              status="success"
              title={data ? 'Successfully Updated' : 'Successfully Scheduled'}
            />
            <ShareInterviewContent url={linkToInterview} />
          </>
        )}

        {scheduleProgress === 'documents' && (
          <Documents
            editable
            email={candidateEmail || values.candidateEmail}
            userName={candidateName || values.candidateName}
            interviewName={jobName || values.jobName}
          />
        )}

        {scheduleProgress === 'started' && (
          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ interviewType: 'recruiter', recording: true }}
            hideRequiredMark
          >
            <Form.Item name="interviewType" label="Interview Type" rules={[{ required: true }]}>
              <Select onChange={type => setType(type)}>
                <Option value="recruiter">You + Candidate</Option>
                <Option value="client">Client + Candidate (Send Out)</Option>
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
                  label="Interview Time"
                  name="interviewTime"
                  rules={[{ required: true, message: 'Please choose the Interview Time' }]}
                >
                  <SchedulePicker />
                </Form.Item>
              </Col>
            </Row>
            {type === 'client' && <ClientInfo />}

            <AdvancedSettings type={type} />

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

const AdvancedSettings = ({ type }) => {
  return (
    <>
      <Collapse className="collapse" bordered={false}>
        <Panel
          style={customPanelStyle}
          className="removeCollapsePadding"
          header="Advanced Configuration"
          key="1"
        >
          <Form.Item label="Record Interview" name="recording" valuePropName="checked">
            <Switch checkedChildren="Yes" unCheckedChildren="No" defaultChecked />
          </Form.Item>
          <JobName />
          {/* > */}
          {type === 'client' && (
            <>
              <ExtraClientInfo />
              <ClientContact />
              <PrepRoom />
              <FollowUpTime />
              <SendOutTemplates />
            </>
          )}
          {type === 'recruiter' && (
            <>
              <Branch />
              <BranchTemplate />
            </>
          )}
        </Panel>
      </Collapse>
    </>
  );
};

const Branch = () => (
  <Row gutter={16}>
    <Col span={24}>
      <Form.Item name="phone" label="Phone Number">
        <Input placeholder="Your phone number" />
      </Form.Item>
    </Col>
  </Row>
);

const JobName = () => (
  <Row gutter={16}>
    <Col span={24}>
      <Form.Item name="jobName" label="Job Title">
        <Input placeholder="Name of the Role" />
      </Form.Item>
    </Col>
  </Row>
);

const ClientContact = () => (
  <>
    <Row gutter={16}>
      <span style={{ marginLeft: 8 }}>Who should the client reach out to after the interview?</span>
      <Col span={12}>
        <Form.Item name="clientContactName" label="Contact">
          <Input placeholder="Contact name" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="clientContactEmail"
          label="Client Contact Email"
          rules={[{ type: 'email', message: 'The input is not valid E-mail!' }]}
        >
          <Input placeholder="Contact email" />
        </Form.Item>
      </Col>
    </Row>
    <Row>
      <Col span={24}>
        <Form.Item name="phone" label="Contact Phone Number">
          <Input placeholder="Contact phone number" />
        </Form.Item>
      </Col>
    </Row>
  </>
);

const FollowUpTime = () => (
  <Row gutter={16}>
    <span style={{ marginLeft: 8 }}>
      After the interview - when are you meeting with the candidate/client?
    </span>
    <Col span={12}>
      <Form.Item name="candidateDebriefTime" label="Candidate Debrief Time">
        <DatePicker disabledDate={disabledDate} {...calendarProps} />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item name="clientDebriefTime" label="Client Debrief Time">
        <DatePicker disabledDate={disabledDate} {...calendarProps} />
      </Form.Item>
    </Col>
  </Row>
);

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

const ExtraClientInfo = () => (
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item name="clientTitle" label="Client Title">
        <Input placeholder="Client's job position" />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item name="clientCompany" label="Client Company">
        <Input placeholder="Client's company" />
      </Form.Item>
    </Col>
  </Row>
);

const BranchTemplate = () => {
  const { data: liveTemplate, isLoading } = useLiveTemplates();
  const recruiterTemplate = liveTemplate?.recruiterTemplates?.template1?.html || '';
  return (
    <Row gutter={16}>
      <Col span={24}>
        {/* application crashes without the initialValue='' seems to be a bug with quil in form.  */}
        {/* {console.log({ candidateTemplate })} */}

        {!isLoading && (
          <Form.Item
            name="recruiterTemplate"
            label="Recruiter Template"
            initialValue={recruiterTemplate}
          >
            <ReactQuill
              className="quill-height"
              // defaultValue={recruiterTemplate}
              placeholder="Add template for the recruiter"
            />
          </Form.Item>
        )}
      </Col>
    </Row>
  );
};

const SendOutTemplates = () => {
  const { data: liveTemplate, isLoading } = useLiveTemplates();

  const candidateTemplate = liveTemplate?.candidateTemplates?.template1?.html || '';
  const clientTemplate = liveTemplate?.clientTemplates?.template1?.html || '';

  return (
    <>
      {!isLoading && (
        <Row gutter={16}>
          <Col span={24}>
            {/* application crashes without the initialValue='' seems to be a bug with quil in form.  */}
            <Form.Item
              name="candidateTemplate"
              label="Candidate Prep Template"
              initialValue={candidateTemplate}
            >
              <ReactQuill className="quill-height" placeholder="Add template for the candidate" />
            </Form.Item>
          </Col>
          <Col span={24}>
            {/* application crashes without the initialValue='' seems to be a bug with quil in form.  */}
            <Form.Item name="clientTemplate" label="Client Template" initialValue={clientTemplate}>
              <ReactQuill className="quill-height" placeholder="Add template for the client" />
            </Form.Item>
          </Col>
        </Row>
      )}
    </>
  );
};

const PrepRoom = () => (
  <Row gutter={16}>
    <Col span={24}>
      <Form.Item label="Prep Room Times" name="prepRoomTime">
        <SchedulePicker />
      </Form.Item>
    </Col>
  </Row>
);

export default ScheduleButton;
