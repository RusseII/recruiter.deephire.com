import React, { useState, useEffect } from 'react';
import { DeleteOutlined, PlusOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons';
import {
  Table,
  Button,
  Tabs,
  Avatar,
  Spin,
  Tooltip,
  Popconfirm,
  Select,
  Tag,
  Space,
  Drawer,
  Radio,
  Form,
} from 'antd';
import readableTime from 'readable-timestamp';
import { connect } from 'dva';
import {
  getInvites,
  getTeam,
  deleteInvites,
  putInvites,
  deleteUsers,
  getCompany,
  updateRecruiterAppData,
} from '@/services/api';
import { getAuthority } from '@/utils/authority';
import InviteForm from '@/components/InviteForm';

const isAdmin = () => JSON.stringify(getAuthority()) === JSON.stringify(['admin']);
const { Option } = Select;

const { TabPane } = Tabs;

const Team = () => {
  const [team, setTeam] = useState(null);
  const [companyTeams, setCompanyTeams] = useState(null);
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
  const [selectedRecruiter, setSelectedRecruiter] = useState(false);

  const onFinish = async values => {
    const { user_id: id } = selectedRecruiter;
    await updateRecruiterAppData(id, values, 'User data succesfully updated!');
    setSelectedRecruiter(false);
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
      title: 'Role',
      render(test, data) {
        const {
          app_metadata: { role },
        } = data;
        return <Tag>{role}</Tag>;
      },
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
      title: 'Teams',
      // dataIndex: 'app_metadata.role',
      render(test, data) {
        const {
          app_metadata: { team },
        } = data;
        if (Array.isArray(team)) {
          return (
            <>
              {team.map(singleTeam => (
                <Tag>{singleTeam}</Tag>
              ))}
            </>
          );
        }
        return <Tag>{team}</Tag>;
      },
    },

    isAdmin()
      ? {
          title: 'Actions',
          render(test, data) {
            const { name, user_id: userId } = data;
            return (
              <Space>
                <Tooltip placement="left" title="Edit User">
                  <Button shape="circle" onClick={() => setSelectedRecruiter(data)}>
                    <EditOutlined />
                  </Button>
                </Tooltip>
                <Popconfirm
                  title={`Are you sure you want to delete ${name}?`}
                  onConfirm={() => deleteUser(userId, name)}
                  okText="Delete User"
                  okType="danger"
                  cancelText="Cancel"
                >
                  <Tooltip placement="left" title="Delete User">
                    <Button shape="circle">
                      <DeleteOutlined />
                    </Button>
                  </Tooltip>
                </Popconfirm>
              </Space>
            );
          },
        }
      : {},
  ];

  const columnsInvites = [
    {
      title: 'Email',
      dataIndex: 'invitedEmail',
    },
    {
      title: 'Role',
      render(test, data) {
        const { role } = data;
        return <Tag>{role}</Tag>;
      },
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
      title: 'Team',
      // dataIndex: 'app_metadata.role',
      render(test, data) {
        const { team } = data;
        return <Tag>{team}</Tag>;
      },
    },
    isAdmin()
      ? {
          title: 'Actions',
          render(test, data) {
            const { invitedEmail, _id } = data;
            return (
              <Space>
                <Popconfirm
                  title={`Resend an invite to ${invitedEmail}?`}
                  onConfirm={() => resendInvite(_id, invitedEmail)}
                  okText="Resend Invite"
                  cancelText="Cancel"
                >
                  <Tooltip placement="left" title="Resend Invite">
                    <Button shape="circle">
                      <ReloadOutlined />
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
                    <Button shape="circle">
                      <DeleteOutlined />
                    </Button>
                  </Tooltip>
                </Popconfirm>
              </Space>
            );
          },
        }
      : {},
  ];

  useEffect(() => {
    const getTeamData = async () => {
      const teamMembers = await getTeam();
      const users = await getInvites();
      const companyData = await getCompany();
      setTeam(teamMembers);
      setInvites(users);
      setCompanyTeams(companyData?.teams);
    };
    getTeamData();
  }, [reload]);

  return (
    <div style={{ paddingTop: 12 }}>
      <Drawer
        title="Edit User"
        placement="right"
        onClose={() => setSelectedRecruiter(false)}
        visible={!!selectedRecruiter}
      >
        <Form
          key={selectedRecruiter.user_id}
          name="basic"
          onFinish={onFinish}
          initialValues={{
            role: selectedRecruiter.app_metadata?.role,
            team: selectedRecruiter.app_metadata?.team,
          }}
          hideRequiredMark
        >
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Radio.Group>
              <Radio.Button key="user" value="user">
                User
              </Radio.Button>
              <Radio.Button key="admin" value="admin">
                Admin
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Teams"
            name="team"
            rules={[{ required: true, message: 'Please select teams' }]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              // onChange={handleChange}
            >
              {companyTeams?.map(({ team }) => <Option key={team}>{team}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Update User
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <InviteForm
        companyTeams={companyTeams}
        reload={setReload}
        visible={inviteUsers}
        toggleVisible={setInviteUsers}
      />

      <Tabs
        tabBarExtraContent={
          isAdmin() ? (
            <Button
              type="primary"
              ghost
              onClick={() => setInviteUsers(true)}
              style={{ marginBottom: 12 }}
              icon={<PlusOutlined />}
            >
              Invite Users
            </Button>
          ) : null
        }
        defaultActiveKey="1"
      >
        <TabPane tab="Current Users" key="1">
          <Spin spinning={!team}>
            <Table dataSource={team} pagination={false} columns={columnsTeam} scroll={{ x: 400 }} />{' '}
          </Spin>
        </TabPane>
        <TabPane tab="Invited Users" key="2">
          <Spin spinning={!invites}>
            <Table
              dataSource={invites}
              pagination={false}
              columns={columnsInvites}
              scroll={{ x: 400 }}
            />{' '}
          </Spin>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(Team);
