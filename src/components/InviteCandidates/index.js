import React from 'react';
import { Row, Button, Drawer, Input, Icon, Form, Card, Typography } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;

// const { Panel } = Collapse;
const FormItem = Form.Item;

let uuid = 1;

const message1 =
  'Thank you for your application.  We would like to invite you to complete a video introduction so that we can get to know you a little better.';

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
  const formItems = keys.map((k, index) => {
    return (
      <Card hoverable style={{ height: 90, marginBottom: 8 }}>
        <Row type="flex">
          <FormItem style={{ width: '50%' }} required key={k}>
            {getFieldDecorator(`fullName[${k}]`, {
              initialValue: null,
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please add candidate full name.',
                },
              ],
            })(<Input style={{ width: '90%', marginRight: 8 }} placeholder="Full Name" />)}
          </FormItem>

          <FormItem style={{ width: '50%' }} required key={k}>
            {getFieldDecorator(`candidateEmail[${k}]`, {
              initialValue: null,
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please add candidate email.',
                },
              ],
            })(<Input style={{ width: '90%', marginRight: 8 }} placeholder="Candidate Email" />)}

            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={keys.length === 1}
                onClick={() => remove(form, k)}
              />
            ) : null}
          </FormItem>
        </Row>
      </Card>
    );
  });
  return formItems;
};

// const customPanelStyle = {
//   background: '#f7f7f7',
//   borderRadius: 4,
//   marginBottom: 24,
//   border: 0,
//   overflow: 'hidden',
// };

const InviteCandidates = Form.create()(({ form, inviteCandidates, setInviteCandidates }) => {
  const add = () => {
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid += 1;
    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  return (
    <Drawer
      width={window.innerWidth > 720 ? 720 : null}
      title="Invite Candidates"
      visible={inviteCandidates}
      drawerStyle={{ backgroundColor: '#f0f2f5' }}
      //   visible={Boolean(inviteCandidates)}
      onClose={() => setInviteCandidates(flag => !flag)}
      //   onOk={() => (!finished ? setFinished(true) : reset())}
    >
      {createFormItems(form)}
      <Button type="link" onClick={add}>
        <Icon type="plus" /> Add Candidate
      </Button>
      <Title level={4} style={{ marginTop: 24 }}>
        Message to Candidates
      </Title>
      <TextArea defaultValue={message1} autoSize={{ minRows: 5 }} />
      {/* <Paragraph editable>{message1}</Paragraph> */}
      {/* <div style={{ marginTop: 50 }}>
        Reminders make sure your interviews get completed. Use ours, or create your own below.
      </div>
      <Collapse>
        <Panel style={customPanelStyle} header="Candidate Reminders" key="1">
          Send after 2 days
          <TextArea defaultValue={message2} autoSize />
          Send after 5 days
          <TextArea defaultValue={message3} autoSize />
        </Panel>
      </Collapse> */}
      <Button type="primary" style={{ marginTop: 24, width: '100%' }}>
        Save and send invitations
      </Button>
    </Drawer>
  );
});

// const message2 = `We hope that you are well!

//   We are checking in to make sure that you received our invitation to the video interview. This is an opportunity for us to get to know you beyond the resume.

//   We take every application seriously and the videos help us to shortlist for face-to-face interviews. We have included the link again [jobLink].

//   We are closing applications on the [jobDeadline] and hope that we will hear from you.

//   Kind regards,
//   [userName]
//   [companyName]
//   [companyLogo]`;

// const message3 = `Hoping you are well!

//   This is a reminder that applications for the [jobTitle] position are closing in [numberOfDays] days. We were excited by your initial interest and hope to receive your interview.

//   Due to the high number of applications we receive for our roles, video interviews give us a more accurate assessment of who we progress to the next stages, beyond the resume. Thank you for your understanding and we look forward to your response. We have included a link to the interview [jobLink].

//   Kind regards,
//   [userName]
//   [companyName]
//   [companyLogo]`;

// const message4 = `This is a reminder that the interview submissions close tomorrow. We would love to consider you for this role, and we have included an interview link [jobLink].

//   Videos help us to ensure that we have more objectivity over our hiring practices and allow us to give everyone a fair go when applying for our roles.

//   We look forward to your application.

//   Kind regards,
//   [userName]
//   [companyName]
//   [companyLogo]`;
export default InviteCandidates;
