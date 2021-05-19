import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Table, Button, Spin, Tooltip, Popconfirm } from 'antd';
import { connect } from 'dva';
import { useCompany } from '@/services/apiHooks';
import { updateCompany } from '@/services/api';
import { getAuthority } from '@/utils/authority';

const isAdmin = () => JSON.stringify(getAuthority()) === JSON.stringify(['admin']);

const deleteTeam = async (team, companyData, mutateCompanyData) => {
  if (!companyData) return null;
  const teams = companyData.teams.filter(teamDetails => teamDetails.team !== team);
  const companyUpdate = await updateCompany({ teams }, 'Team deleted');
  mutateCompanyData();
  return companyUpdate;
};

const Team = () => {
  const { data: companyData, isLoading, mutate: mutateCompanyData } = useCompany();

  const columnsTeam = [
    {
      title: 'Logo',
      dataIndex: 'logo',
    },
    {
      title: 'Team',
      dataIndex: 'team',
    },
    {
      title: 'Brand',
      dataIndex: 'Brand',
    },
    isAdmin()
      ? {
          title: 'Actions',
          render(test, data) {
            const { team } = data;
            return (
              <>
                {/* <Tooltip placement="left" title="Edit team">
                  <Button shape="circle">
                    <EditOutlined />
                  </Button>
                </Tooltip> */}
                <Popconfirm
                  title={`Are you sure you want to delete ${team}?`}
                  onConfirm={() => deleteTeam(team, companyData, mutateCompanyData)}
                  okText="Delete User"
                  okType="danger"
                  cancelText="Cancel"
                >
                  <Tooltip placement="left" title="Delete Team">
                    <Button shape="circle">
                      <DeleteOutlined />
                    </Button>
                  </Tooltip>
                </Popconfirm>
              </>
            );
          },
        }
      : {},
  ];

  return (
    <Spin spinning={isLoading}>
      <Table dataSource={companyData?.teams} pagination={false} columns={columnsTeam} />{' '}
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
