import React, { useState } from 'react';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import {
  Table,
  Button,
  Spin,
  Tooltip,
  Popconfirm,
  PageHeader,
  Drawer,
  Space,
  Form,
  Input,
} from 'antd';
import { connect } from 'dva';
import { useCompany } from '@/services/apiHooks';
import { updateCompany } from '@/services/api';
import { getAuthority } from '@/utils/authority';

const isAdmin = () => JSON.stringify(getAuthority()) === JSON.stringify(['admin']);

const deleteTeam = async (team, companyData, mutateCompanyData) => {
  if (!companyData) return null;
  const teams = companyData.teams.filter(teamDetails => teamDetails.team !== team);
  mutateCompanyData({ ...companyData, teams }, false);
  const companyUpdate = await updateCompany({ teams }, 'Team deleted');
  mutateCompanyData();

  return companyUpdate;
};

const editTeam = async (teamData, companyData, mutateCompanyData) => {
  if (!companyData) return null;
  const index = companyData.teams.findIndex(teamDetails => teamDetails.team === teamData.team);
  // eslint-disable-next-line no-param-reassign
  companyData.teams[index] = teamData;
  const { teams } = companyData;
  mutateCompanyData({ ...companyData, teams });
  const companyUpdate = await updateCompany({ teams }, 'Team deleted');
  mutateCompanyData();
  return companyUpdate;
};

const addTeam = async (companyData, newTeam, mutateCompanyData) => {
  if (!companyData) return null;
  if (!companyData.teams) {
    // eslint-disable-next-line no-param-reassign
    companyData.teams = [];
  }
  companyData.teams.unshift(newTeam);
  const { teams } = companyData;
  console.log({ mutateCompanyData });
  mutateCompanyData({ ...companyData, teams }, false);
  const companyUpdate = await updateCompany({ teams }, 'Team Added');
  mutateCompanyData();
  return companyUpdate;
};

const onFinishFailed = () => {};
const Team = () => {
  const { data: companyData, isLoading, mutate: mutateCompanyData } = useCompany();
  const [isEditing, setIsEditing] = useState(false);
  console.log(companyData?.teams);
  const onFinish = newTeam => {
    addTeam(companyData, newTeam, mutateCompanyData);
    setIsEditing(false);
  };
  const checkExistingTeam = () => ({
    validator(_, value) {
      const isTeamAlreadyCreated = companyData?.teams?.find(
        singleTeamData => singleTeamData.team === value
      );
      if (isTeamAlreadyCreated) {
        return Promise.reject(new Error('This team already exists'));
      }
      return Promise.resolve();
    },
  });

  const CreateTeamButton = () => {
    if (!isAdmin) return null;

    return (
      <Button type="primary" ghost onClick={() => setIsEditing(true)} icon={<PlusOutlined />}>
        Create Team
      </Button>
    );
  };
  const columnsTeam = [
    // {
    //   title: 'Logo',
    //   dataIndex: 'logo',
    // },
    {
      title: 'Team',
      dataIndex: 'team',
    },
    // {
    //   title: 'Brand',
    //   dataIndex: 'Brand',
    // },
    isAdmin()
      ? {
          title: 'Actions',
          render(test, data) {
            const { team } = data;
            return (
              <Space>
                {/* <Tooltip placement="left" title="Edit team">
                  <Button shape="circle" onClick={() => setIsEditing(true)}>
                    <EditOutlined />
                  </Button>
                </Tooltip> */}
                <Popconfirm
                  title={`Are you sure you want to delete ${team}?`}
                  onConfirm={() => deleteTeam(team, companyData, mutateCompanyData)}
                  okText="Delete Team"
                  okType="danger"
                  cancelText="Cancel"
                >
                  <Tooltip placement="left" title="Delete Team">
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

  return (
    <Spin spinning={isLoading}>
      <PageHeader extra={<CreateTeamButton />} />
      <Table
        key={JSON.stringify(companyData)}
        dataSource={companyData?.teams}
        pagination={false}
        columns={columnsTeam}
      />
      <Drawer
        title="Team"
        placement="right"
        onClose={() => setIsEditing(false)}
        visible={isEditing}
      >
        <Form
          // {...layout}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          hideRequiredMark
        >
          <Form.Item
            label="Team Name"
            name="team"
            rules={[{ required: true, message: 'Please enter a team name' }, checkExistingTeam]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Create Team
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </Spin>
  );
};

// return (
//   <Modal
//     title="Invite New Users"
//     visible={visible}
//     onOk={okHandle}
//     okText="Invite"
//     onCancel={() => toggleVisible(false)}
//   >
//     <Form onSubmit={okHandle}>
//       <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Invitation Email">
//         {form.getFieldDecorator('invitedEmail', {
//           rules: [
//             { type: 'email', message: 'The input is not valid E-mail!' },
//             {
//               required: true,
//               message: 'Please input the email address to invite',
//             },
//           ],
//         })(<Input placeholder="email" />)}
//       </FormItem>
//       <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Role">
//         {form.getFieldDecorator('role', { initialValue: 'user' })(
//           <Select style={{ width: 120 }}>
//             <Option value="user">user</Option>
//             <Option value="admin">admin</Option>
//           </Select>
//         )}
//       </FormItem>
//       {companyTeams && (
//         <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Team">
//           {form.getFieldDecorator('team')(
//             <Select placeholder="Please select" style={{ maxWidth: 250 }}>
//               {companyTeams.map(team => (
//                 <Option value={team.team}>{team.team}</Option>
//               ))}
//             </Select>
//           )}
//         </FormItem>
//       )}
//     </Form>
//   </Modal>
// );

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(Team);
