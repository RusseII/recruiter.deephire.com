import React, { useState } from 'react';
import { Table, Button, Row, Col, Modal, Tabs, Avatar } from 'antd';
import readableTime from 'readable-timestamp';
import { connect } from 'dva';

const { TabPane } = Tabs;

const testData = [
  {
    email: 'russell@deephire.com',
    email_verified: true,
    name: 'Russell Ratcliffe',
    given_name: 'Russell',
    family_name: 'Ratcliffe',
    picture: 'https://lh3.googleusercontent.com/a-/AAuE7mCtdLDEL8-YGVo6pvtYER5dr6rv4IAwFHJXRYP2sw',
    locale: 'en',
    updated_at: '2019-11-11T15:30:36.730Z',
    user_id: 'google-oauth2|108316160914067599948',
    nickname: 'russell',
    identities: [
      {
        provider: 'google-oauth2',
        access_token:
          'ya29.ImWwB93_4XkiIR-wi43x7SFikBsfQJmM4tWiaB3GAQ7MQeF2e7jT9T9ASYcTqMkxfUpjYKqHisclGxiMv0u0_0M06FS1oJoXz3b3inAS8jLuqrz1nxh7mqP7UTvxTZl2oXhFyZ36RA',
        expires_in: 3600,
        user_id: '108316160914067599948',
        connection: 'google-oauth2',
        isSocial: true,
      },
    ],
    created_at: '2017-09-28T15:30:44.081Z',
    user_metadata: {
      testData: 'wtf',
    },
    last_login: '2019-11-11T15:30:36.730Z',
    last_ip: '172.58.223.204',
    logins_count: 618,
    app_metadata: {
      wow: 'test',
      companyId: '5dc5d305a4ea435efa57f644',
    },
  },
  {
    email: 'rratcliffe57@gmail.com',
    email_verified: true,
    name: 'Russell Ratcliffe',
    given_name: 'Russell',
    family_name: 'Ratcliffe',
    picture: 'https://lh3.googleusercontent.com/a-/AAuE7mDw8U7BRTTWj56gtYN5LinfYOrHkA28kSzwVumtBw',
    locale: 'en',
    updated_at: '2019-11-08T22:08:52.884Z',
    user_id: 'google-oauth2|117678604858925570677',
    nickname: 'rratcliffe57',
    identities: [
      {
        provider: 'google-oauth2',
        access_token:
          'ya29.ImWwB-caInpfMJ6GmzXu9VbjzomXG-yQARlZ4DHpXyIDkns0c-6WmEL3G-A_p-ew9lShoq5h50uzqIggqfsx6i3EgdNxwazgepKqMVCpmyzg-J1h7Qvr3hCUOb07ofPiWCeMqpvc_g',
        expires_in: 3600,
        user_id: '117678604858925570677',
        connection: 'google-oauth2',
        isSocial: true,
      },
    ],
    created_at: '2017-10-02T20:18:21.441Z',
    user_metadata: {},
    last_login: '2019-11-08T22:08:52.884Z',
    last_ip: '50.208.146.186',
    logins_count: 363,
    app_metadata: {
      companyId: '5dc5d305a4ea435efa57f644',
    },
  },
  {
    email_verified: false,
    email: 'testing@gmail.com',
    updated_at: '2019-11-11T01:47:08.270Z',
    user_id: 'auth0|5ccf20bf262b6a0e047c8171',
    name: 'testing@gmail.com',
    picture:
      'https://s.gravatar.com/avatar/9ad574806427070b94735f216e9abdc1?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png',
    nickname: 'testing',
    identities: [
      {
        user_id: '5ccf20bf262b6a0e047c8171',
        provider: 'auth0',
        connection: 'EmailDB',
        isSocial: false,
      },
    ],
    created_at: '2019-05-05T17:43:27.723Z',
    user_metadata: {},
    last_login: '2019-11-11T01:47:08.270Z',
    last_ip: '135.84.167.43',
    logins_count: 101,
    app_metadata: {
      companyId: '5dc5d305a4ea435efa57f644',
      wow: 'test',
    },
  },
];

const columns = [
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

const Team = () => {
  const [inviteUsers, setInviteUsers] = useState(false);
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
          <Table dataSource={testData} pagination={false} columns={columns} />{' '}
        </TabPane>
        <TabPane tab="Invited Users" key="2">
          <Table dataSource={testData} pagination={false} columns={columns} />{' '}
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
