import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col, Modal, Tabs, Avatar, Spin } from 'antd';
import readableTime from 'readable-timestamp';
import { connect } from 'dva';
import { getInvites, getTeam } from '@/services/api';

const { TabPane } = Tabs;

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
];

const Team = () => {
  const [team, setTeam] = useState(null);
  const [invites, setInvites] = useState(null);
  const [inviteUsers, setInviteUsers] = useState(false);

  useEffect(() => {
    const getTeamData = async () => {
      const teamMembers = await getTeam();
      const users = await getInvites();
      setTeam(teamMembers);
      setInvites(users);
    };
    getTeamData();
  }, []);
  return (
    <div style={{ paddingTop: 12 }}>
      <Modal
        title="Invite New Users"
        visible={inviteUsers}
        onOk={() => setInviteUsers(false)}
        onCancel={() => setInviteUsers(false)}
      />
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

// @connect(({ user }) => ({
//   currentUser: user.currentUser,
// }))
export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(Team);
