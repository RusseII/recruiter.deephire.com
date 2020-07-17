/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import {
  ShareAltOutlined,
  MinusCircleTwoTone,
  PlusOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Col,
  Row,
  Button,
  Drawer,
  Input,
  Card,
  Typography,
  Tabs,
  DatePicker,
  Collapse,
  message,
} from 'antd';

// import { getHttpUrl } from '@bit/russeii.deephire.utils.utils';
import { inviteCandidatesToInterview } from '@/services/api';

import DirectLink from './DirectLink';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

// const { Panel } = Collapse;
const { TabPane } = Tabs;
const FormItem = Form.Item;

let uuid = 100;

const message1 = `Thank you for your application.  We would like to invite you to complete a video introduction so that we can get to know you a little better.
`;

const message2 = `We are checking in to make sure that you received our invitation to the video interview. This is an opportunity to get to know you beyond the resume.

We take every application seriously and the videos help us to shortlist for face-to-face interviews.
`;

const message3 = `This is a reminder that applications are closing soon. We were excited by your initial interest and hope to receive your interview.

Thank you, have a great day!
`;
const directLinkMessage =
  'This is the Direct Link for candidates to take this interview. If you navigate to this URL, you will see the introductory page to begin the video interview. You can send this link out via email to invite individual candidates, or it can be saved as part of an email template in your ATS/CRM to bulk invite candidates. Please note, we cannot track the invite status for candidates who have been invited this way.';

const basicMessages = [
  { followUp: 0, message: message1 },
  { followUp: 0, message: message2 },
  { followUp: 0, message: message3 },
];
const remove = (form, k) => {
  const keys = form.getFieldValue('keys');
  if (keys.length === 1) {
    return;
  }

  form.setFieldsValue({
    keys: keys.filter(key => key !== k),
  });
};

const createFormItems = form => {
  const { getFieldDecorator, getFieldValue } = form;

  getFieldDecorator('keys', {
    initialValue: [0],
  });
  const keys = getFieldValue('keys');
  const formItems = keys.map(k => {
    return (
      <Card
        hoverable
        bodyStyle={{ paddingLeft: 16, paddingRight: 16 }}
        style={{ height: 90, marginBottom: 8, marginRight: 5 }}
      >
        <Row gutter={8} type="flex">
          <Col span={12}>
            <FormItem required key={k}>
              {getFieldDecorator(`fullName[${k}]`, {
                initialValue: null,
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'Name required',
                  },
                ],
              })(<Input placeholder="Full Name" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem required key={k}>
              {getFieldDecorator(`candidateEmail[${k}]`, {
                initialValue: null,
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'Email required.',
                  },
                  {
                    type: 'email',
                    message: 'Email invalid',
                  },
                ],
              })(<Input placeholder="Email" />)}
            </FormItem>
          </Col>
        </Row>
        {keys.length > 1 && (
          <MinusCircleTwoTone
            style={{ position: 'absolute', right: -5, top: -5, overflow: 'visible' }}
            twoToneColor="#f5222d"
            disabled={keys.length === 1}
            onClick={() => remove(form, k)}
          />
        )}
      </Card>
    );
  });
  return formItems;
};

const customPanelStyle = {
  backgroundColor: '#f0f2f5',
  border: 'none',
};

const InviteCandidates = Form.create()(
  ({ form, inviteCandidates, setInviteCandidates, setReload }) => {
    const [messages, setMessages] = useState(null);
    useEffect(() => {
      if (inviteCandidates?.messages) {
        setMessages(inviteCandidates.messages);
      } else {
        // without destructuring this, there is a weird bug where react does not rerender with the new messages
        setMessages([...basicMessages]);
      }
    }, [inviteCandidates]);
    const handleSubmit = e => {
      e.preventDefault();
      const { validateFields } = form;
      validateFields(async (err, values) => {
        if (err) {
          message.error('Fix errors and try again');
          document.getElementsByClassName('ant-drawer-wrapper-body')[1].scrollTo(0, 0);
          return;
        }
        const cleanedValueData = values;
        cleanedValueData.fullName = values.fullName.filter(value => value != null);
        cleanedValueData.candidateEmail = values.candidateEmail.filter(value => value != null);
        cleanedValueData.recipients = cleanedValueData.candidateEmail.map((email, i) => {
          return { email: email.toLowerCase(), fullName: cleanedValueData.fullName[i] };
        });
        cleanedValueData.messages = messages;
        await inviteCandidatesToInterview(cleanedValueData, inviteCandidates._id, 'Invites Sent');
        setInviteCandidates(flag => !flag);
        setReload(flag => !flag);
      });
    };
    const change = ({ target: { value } }, i) =>
      setMessages(messagesArray => {
        messagesArray[i] = { ...messagesArray[i], message: value };
        return messagesArray;
      });
    const add = () => {
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(uuid);
      uuid += 1;
      form.setFieldsValue({
        keys: nextKeys,
      });
    };
    const { getFieldDecorator } = form;
    return (
      <Drawer
        width={window.innerWidth > 720 ? 378 : null}
        title="Invite Candidates"
        visible={inviteCandidates}
        drawerStyle={{ backgroundColor: '#f0f2f5', overflowY: 'scroll' }}
        //   visible={Boolean(inviteCandidates)}
        onClose={() => setInviteCandidates(flag => !flag)}
        //   onOk={() => (!finished ? setFinished(true) : reset())}
      >
        <Title level={3}>{inviteCandidates?.interviewName}</Title>
        {inviteCandidates && (
          <Tabs defaultActiveKey={inviteCandidates && inviteCandidates.activeTab}>
            <TabPane
              tab={
                <span>
                  <UserAddOutlined />
                  Individual
                </span>
              }
              key="1"
            >
              <Form onSubmit={handleSubmit}>
                {createFormItems(form)}
                <Button type="link" onClick={add}>
                  <PlusOutlined /> Add Candidate
                </Button>
                <Title level={4} style={{ marginTop: 24 }}>
                  Message to Candidates
                </Title>
                <TextArea
                  onChange={e => change(e, 0)}
                  defaultValue={
                    inviteCandidates.messages
                      ? inviteCandidates.messages[0]?.message
                      : messages?.[0]?.message
                  }
                  autoSize={{ minRows: 5 }}
                />

                <Row style={{ marginTop: 16 }} type="flex">
                  <Col>
                    <Paragraph strong style={{ lineHeight: '40px' }}>
                      Deadline
                    </Paragraph>
                  </Col>
                  <Col style={{ flexGrow: 1, marginLeft: 8 }}>
                    <FormItem key="deadline">
                      {getFieldDecorator('deadlineDate', {
                        rules: [
                          {
                            required: false,
                          },
                        ],
                      })(<DatePicker style={{ width: '100%' }} />)}
                    </FormItem>
                  </Col>
                </Row>
                {/* <Paragraph editable>{message1}</Paragraph> */}

                <Collapse className="collapse" bordered={false}>
                  <Panel
                    style={customPanelStyle}
                    className="removeCollapsePadding"
                    header="Configure Candidate Reminders"
                    key="1"
                  >
                    <div style={{ marginTop: 16, marginBottom: 8 }}> Send after 2 days</div>
                    <TextArea
                      onChange={e => change(e, 1)}
                      defaultValue={
                        inviteCandidates.messages
                          ? inviteCandidates.messages[1]?.message
                          : messages?.[1]?.message
                      }
                      autoSize
                    />
                    <div style={{ marginTop: 16, marginBottom: 8 }}> Send after 5 days </div>
                    <TextArea
                      onChange={e => change(e, 2)}
                      defaultValue={
                        inviteCandidates.messages
                          ? inviteCandidates.messages[2]?.message
                          : messages?.[2]?.message
                      }
                      autoSize
                    />
                  </Panel>
                </Collapse>

                <Button htmlType="submit" type="primary" style={{ marginTop: 24, width: '100%' }}>
                  Save and send invitations
                </Button>
              </Form>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <ShareAltOutlined />
                  Direct Link
                </span>
              }
              key="2"
            >
              <DirectLink link={inviteCandidates.shortUrl} message={directLinkMessage} />
            </TabPane>
          </Tabs>
        )}
      </Drawer>
    );
  }
);

export default InviteCandidates;
