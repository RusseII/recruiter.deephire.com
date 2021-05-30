import React from 'react';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Input, Modal, Select } from 'antd';

import { sendInvites } from '@/services/api';

const FormItem = Form.Item;
const { Option } = Select;

const InviteForm = Form.create()(props => {
  const { visible, form, toggleVisible, reload, companyTeams } = props;

  const okHandle = async e => {
    e.preventDefault();

    form.validateFields(async (err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const { invitedEmail, role, team } = fieldsValue;
      const successMessage = `Invited ${invitedEmail}`;
      sendInvites(invitedEmail, role, team, successMessage);

      toggleVisible(false);
      reload(flag => !flag);
    });
  };

  return (
    <Modal
      title="Invite New Users"
      visible={visible}
      onOk={okHandle}
      okText="Invite"
      onCancel={() => toggleVisible(false)}
    >
      <Form onSubmit={okHandle}>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Invitation Email">
          {form.getFieldDecorator('invitedEmail', {
            rules: [
              { type: 'email', message: 'The input is not valid E-mail!' },
              {
                required: true,
                message: 'Please input the email address to invite',
              },
            ],
          })(<Input placeholder="email" />)}
        </FormItem>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Role">
          {form.getFieldDecorator('role', { initialValue: 'user' })(
            <Select style={{ width: 120 }}>
              <Option key="user" value="user">
                user
              </Option>
              <Option key="admin" value="admin">
                admin
              </Option>
            </Select>
          )}
        </FormItem>
        {companyTeams && (
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Team">
            {form.getFieldDecorator('team')(
              <Select mode="multiple" placeholder="Please select" style={{ maxWidth: 250 }}>
                {companyTeams.map(team => (
                  <Option value={team.team}>{team.team}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        )}
      </Form>
    </Modal>
  );
});

export default InviteForm;
