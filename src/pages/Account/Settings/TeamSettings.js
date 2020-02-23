import React, { useState, useEffect } from 'react';
import {
  Icon,
  Input,
  Table,
  Button,
  Row,
  Col,
  Modal,
  Tabs,
  Avatar,
  Spin,
  Form,
  Tooltip,
  Popconfirm,
  Select,
} from 'antd';
import readableTime from 'readable-timestamp';
import { connect } from 'dva';
import {
  getInvites,
  getTeam,
  sendInvites,
  deleteInvites,
  putInvites,
  deleteUsers,
} from '@/services/api';

const { Option } = Select;

const FormItem = Form.Item;
const { TabPane } = Tabs;

const Team = () => {
  const [team, setTeam] = useState(null);
  const [invites, setInvites] = useState(null);
  const [inviteUsers, setInviteUsers] = useState(false);
  const [reload, setReload] = useState(false);

  const deleteInvite = async (inviteId, invitedEmail) => {
    await deleteInvites(inviteId, `${invitedEmail}'s invite was deleted`);
    setReload(flag => !flag);
  };

  const resendInvite = async (inviteId, invitedEmail) => {
    await putInvites(inviteId, `Sent invite to ${invitedEmail}`);
    setReload(flag => !flag);
  };

  const deleteUser = async (userId, name) => {
    await deleteUsers(userId, `${name} deleted`);
    setReload(flag => !flag);
  };

  const columnsTeam = [
    {
      title: 'Name',
      render: (text, data) => {
        const { name, picture } = data;

        return (
          <div>
            <Avatar size="small" src={picture} alt="avatar" />
            <span style={{ marginLeft: 8 }}>{name}</span>
          </div>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Last Login',
      render(test, data) {
        const { last_login: lastLogin } = data;
        const dateObj = new Date(lastLogin);
        const displayTime = readableTime(dateObj);
        return displayTime;
      },
    },
    {
      title: 'Actions',
      render(test, data) {
        const { name, user_id: userId } = data;
        return (
          <Popconfirm
            title={`Are you sure you want to delete ${name}?`}
            onConfirm={() => deleteUser(userId, name)}
            okText="Delete User"
            okType="danger"
            cancelText="Cancel"
          >
            <Tooltip placement="left" title="Delete User">
              <Button shape="circle">
                <Icon type="delete" />
              </Button>
            </Tooltip>
          </Popconfirm>
        );
      },
    },
  ];

  const columnsInvites = [
    {
      title: 'Email',
      dataIndex: 'invitedEmail',
    },
    {
      title: 'Invited At',
      render(test, data) {
        const { timestamp } = data;
        const dateObj = new Date(timestamp);
        const displayTime = readableTime(dateObj);
        return displayTime;
      },
    },
    {
      title: 'Invited By',
      dataIndex: 'createdBy',
    },
    {
      title: 'Actions',
      render(test, data) {
        const { invitedEmail, _id } = data;
        return (
          <>
            <Popconfirm
              title={`Resend an invite to ${invitedEmail}?`}
              onConfirm={() => resendInvite(_id, invitedEmail)}
              okText="Resend Invite"
              cancelText="Cancel"
            >
              <Tooltip placement="left" title="Resend Invite">
                <Button shape="circle">
                  <Icon type="reload" />
                </Button>
              </Tooltip>
            </Popconfirm>

            <Popconfirm
              title={`Are you sure you want to delete ${invitedEmail}'s invite?`}
              onConfirm={() => deleteInvite(_id, invitedEmail)}
              okText="Delete Invite"
              okType="danger"
              cancelText="Cancel"
            >
              <Tooltip placement="left" title="Delete Invite">
                <Button style={{ marginLeft: 5 }} shape="circle">
                  <Icon type="delete" />
                </Button>
              </Tooltip>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const getTeamData = async () => {
      const teamMembers = await getTeam();
      const users = await getInvites();
      setTeam(teamMembers);
      setInvites(users);
    };
    getTeamData();
  }, [reload]);

  return (
    <div style={{ paddingTop: 12 }}>
      <InviteForm reload={setReload} visible={inviteUsers} toggleVisible={setInviteUsers} />
      <Row justify="end" type="flex">
        <Col />
      </Row>
      <Tabs
        tabBarExtraContent={
          <Button
            type="primary"
            ghost
            onClick={() => setInviteUsers(true)}
            style={{ marginBottom: 12 }}
            icon="plus"
          >
            Invite Users
          </Button>
        }
        defaultActiveKey="1"
      >
        <TabPane tab="Current Users" key="1">
          <Spin spinning={!team}>
            <Table dataSource={team} pagination={false} columns={columnsTeam} />{' '}
          </Spin>
        </TabPane>
        <TabPane tab="Invited Users" key="2">
          <Spin spinning={!invites}>
            <Table dataSource={invites} pagination={false} columns={columnsInvites} />{' '}
          </Spin>
        </TabPane>
      </Tabs>
      ,
    </div>
  );
};

const InviteForm = Form.create()(props => {
  const { visible, form, toggleVisible, reload } = props;

  const okHandle = async e => {
    e.preventDefault();

    form.validateFields(async (err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const { invitedEmail, role } = fieldsValue;
      const successMessage = `Invited ${invitedEmail}`;
      sendInvites(invitedEmail, role, successMessage);

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
              <Option value="user">user</Option>
              <Option value="admin">admin</Option>
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>
  );
});

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(Team);
