import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Steps,
  Radio,
  Dropdown,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';

import styles from './Candidates.less';

const readableTime = require('readable-timestamp');

const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

    
//  Form.create()
//  class CreateForm extends PureComponent {
//    // (props => {

//    render() {
//     //  const { modalVisible, form, handleAdd, handleModalVisible, selectedRows } = this.props;

//      return <div>{renderContent(this.state.currentStep, 's')}</div>;
//    }
//  };

/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading, user, form }) => ({
  currentUser: user.currentUser,
  rule,
  loading: loading.models.rule,
  // data5: form.step,
}))
@Form.create()
class Candidates extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    currentStep: 1,
  };

  columns = [
    {
      title: 'Interview Name',
      dataIndex: 'interview_name',
    },
    {
      title: 'Name',
      dataIndex: 'user_name',
    },
    {
      title: 'Email',
      dataIndex: 'candidate_email',
    },
    {
      title: 'Time',
      // dataIndex: 'python_datetime',
      sorter: true,
      render(test, data) {
        try {
          const dateObj = new Date(data.python_datetime);
          const displayTime = readableTime(dateObj);
          return <div>{displayTime}</div>;
        } catch {
          return null;
        }
      },
    },
    {
      title: 'View',
      render: (text, data) => (
        <Fragment>
          <a onClick={() => this.openInterview(true, data)}>View</a>
          {/* <a href="">订阅警报</a> */}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const { email } = profile;
    console.log(email, profile);

    const { dispatch } = this.props;
    // const { email } = currentUser;

    if (email) {
      dispatch({
        type: 'rule/fetch',
        payload: email,
      });
    }
    // else{
    //       setTimeout(() => {
    //         dispatch({ type: 'rule/fetch', payload: email })}, 1000);
    //     }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, currentUser } = this.props;
    const { formValues } = this.state;
    const { email } = currentUser;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: email,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    // dispatch({
    //   type: 'rule/fetch',
    //   payload: {},
    // });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      // dispatch({
      //   type: 'rule/fetch',
      //   payload: values,
      // });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  openInterview = (flag, data) => {
    const { company_id, user_id } = data;
    // const {$oid} = _id
    // console.log($oid)
    console.log('id here', data);
    // const url = `http://localhost:8000/interview/view-interviews2/?id=${company_id}&candidate=${user_id}`;
    router.push(`/candidates/view-candidate/?id=${company_id}&candidate=${user_id}`);

    // window.open(url, "_blank");
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/update',
      payload: {
        user_name: fields.user_name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderviewInterview() : this.renderSimpleForm();
  }

  renderContent = (currentStep, formVals) => {
    const { rule: { shareLink } } = this.props;
    console.log(shareLink);
    if (currentStep === 1) {
      return (
        <Modal
          destroyOnClose
          title="Create Shareable Link"
          visible={this.state.modalVisible}
          onOk={this.createLinkButton}
          okText="Create Link"
          onCancel={() => this.handleModalVisible()}
        >
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="email">
            {this.props.form.getFieldDecorator('email', {
              rules: [{ required: true, message: 'Need Email!', min: 1 }],
            })(<Input placeholder="Who do you want to share this with?" />)}
          </FormItem>
        </Modal>
      );
    }
    if (currentStep === 2) {
      return <Modal destroyOnClose title="Create Shareable Link" visible={this.state.modalVisible} onOk={() => this.handleDone()} okText="Done" onCancel={() => this.handleDone()}>
        <div>Here is your shareable link: {shareLink}</div>
        {/* // this.props.data5.shareLink; */}
             </Modal>;
    }
    return null;
  };

  success = () => {
    message.success('Link Created!');
  };

  createLinkButton = () => {
    this.props.form.validateFields((err, data) => {
      if (err) return;
      const { email } = data;
      this.props.form.resetFields();
      // handleAdd(fieldsValue);
      console.log('boom', this.state.selectedRows);
      const shortList = { email, interviews: this.state.selectedRows };
      this.createLink(shortList);
      this.setState({ currentStep: this.state.currentStep + 1 });
    });
  };

  handleDone = () => {
    this.setState({ currentStep: 1 });
    this.handleModalVisible();
  }

  createLink(shortListJson) {
    const { dispatch } = this.props;
    dispatch({ type: 'rule/share', payload: shortListJson });
    this.success();
  }

  render() {
    const {
      rule: { data }, 
     
      rule,
      loading,
      currentUser,
      // data5,
    } = this.props;
    console.log('Currentuser', currentUser);
    console.log(rule)
    console.log(data, "d5")


    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      renderContent: this.renderContent,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="Candidates">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleModalVisible}>Share</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {this.renderContent(this.state.currentStep)}
      </PageHeaderWrapper>
    );
  }
}

export default Candidates;
