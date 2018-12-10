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
  Checkbox
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';

import styles from './ShortLists.less';

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

const today = new Date();
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
    dog: {
      list: [
        {
          name: 'Maren Lates',
          email: 'maren59@google.com',
          clicks: '3',
          last_viewed: today,
          short_url: 'link.deephire.com/34343',
        },
        {
          name: 'Matty Fate',
          email: 'mfate2@zoom.com',
          clicks: '0',
          last_viewed: today,
          short_url: 'link.deephire.com/34re3',
        },
        {},
      ],
    },
  };

  columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'email',
      dataIndex: 'email',
    },
    {
      title: 'Clicks',
      dataIndex: 'clicks',
    },
    {
      title: 'Last Viewed',
      // dataIndex: 'python_datetime',
      sorter: true,
      render(test, data) {
        try {
          const dateObj = new Date(data.last_viewed);
          const displayTime = readableTime(dateObj);
          return <div>{displayTime}</div>;
        } catch {
          return null;
        }
      },
    },
    {
      title: 'Share Link',
      render: (text, data) => (
        <Fragment>
          <a>{data.short_url}</a>
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

  success = () => {
    // const { rule: { shareLink } } = this.props;

    message.success('Link Created!');
  };

  renderContent = (currentStep, formVals) => {
    const {
      rule: { shareLink },
    } = this.props;
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
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Name">
            {this.props.form.getFieldDecorator('name', {})(<Input placeholder="Their email" />)}
          </FormItem>

          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Email">
            {this.props.form.getFieldDecorator('email', {})(
              <Input placeholder="Who do you want to share this with?" />
            )}
          </FormItem>
          <Row gutter={0}>
            <Col span={5} />
            <Col span={15}>
              {' '}
              <Checkbox>Hide Candidate Info</Checkbox>
            </Col>
          </Row>
        </Modal>
      );
    }
    if (currentStep === 2) {
      return (
        <Modal
          destroyOnClose
          title="Create Shareable Link"
          visible={this.state.modalVisible}
          onOk={() => this.handleDone()}
          okText="Done"
          onCancel={() => this.handleDone()}
        >
          <Button type="secondary" onClick={this.handleModalVisible}>
            View all Links
          </Button>{' '}
          <div>Here is your shareable link: {shareLink}</div>
        </Modal>
      );
    }
    return null;
  };

  createLinkButton = () => {
    const { form, currentUser } = this.props;
    const { email: recruiterEmail } = currentUser;
    const { selectedRows, currentStep } = this.state;
    form.validateFields((err, data) => {
      if (err) return;
      let { email } = data;
      form.resetFields();
      // handleAdd(fieldsValue);
      if (!email) email = 'noEmailEntered';
      const shortList = { email, created_by: recruiterEmail, interviews: selectedRows };
      this.createLink(shortList);
      this.setState({ currentStep: currentStep + 1 });
    });
  };

  handleDone = () => {
    this.setState({ currentStep: 1 });
    this.handleModalVisible();
  };

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
    console.log(rule);
    console.log(data, 'd5');

    const { dog, selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    console.log(dog);
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
                  <Button type="primary" onClick={this.handleModalVisible}>
                    Share
                  </Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={dog}
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
