import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, message, Checkbox } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Result from '@/components/Result';
import { showConfirm } from '@/utils/utils';
import ShareCandidateButton from '@/components/ShareCandidateButton';

import styles from './Candidates.less';

const readableTime = require('readable-timestamp');

const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ rule, loading, user }) => ({
  currentUser: user.currentUser,
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class Candidates extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
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
          <a onClick={() => this.openInterview(data)}>View</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const { email } = profile;
    const { dispatch } = this.props;

    if (email) {
      dispatch({
        type: 'rule/fetch',
        payload: email,
      });
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, currentUser } = this.props;
    const { email } = currentUser;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  openInterview = data => {
    const { company_id: companyId, user_id: userId } = data;
    router.push(`/candidates/view-candidate/?id=${companyId}&candidate=${userId}`);
  };

  onCheckHideInfo = e => {
    this.setState({ hideInfo: e.target.checked });
  };

  information = shareLink => (
    <div>
      <Row>
        <Col xs={24} sm={24}>
          {`${shareLink}     `}
          <CopyToClipboard text={shareLink}>
            <Button size="small" icon="copy" />
          </CopyToClipboard>
        </Col>
      </Row>
      <br />
    </div>
  );

  renderContent = currentStep => {
    const {
      rule: { shareLink },
      form,
    } = this.props;
    const { shareEmail, modalVisible } = this.state;

    if (currentStep === 1) {
      return (
        <Modal
          destroyOnClose
          title="Create Shareable Link"
          visible={modalVisible}
          onOk={this.createLinkButton}
          okText="Create Link"
          onCancel={() => this.handleModalVisible()}
        >
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Name">
            {form.getFieldDecorator('name', {})(<Input placeholder="Their name" />)}
          </FormItem>

          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Email">
            {form.getFieldDecorator('email', {})(
              <Input placeholder="Who do you want to share this with?" />
            )}
          </FormItem>
          <Row gutter={0}>
            <Col span={5} />
            <Col span={15}>
              {' '}
              <Checkbox onChange={this.onCheckHideInfo}>Hide Candidate Info</Checkbox>
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
          visible={modalVisible}
          onOk={() => this.handleDone()}
          okText="Done"
          onCancel={() => this.handleDone()}
        >
          <Result
            type="success"
            title="Share Link Created!"
            description={`Send this link to ${shareEmail}`}
            extra={this.information(shareLink, 'russell@deephire.com')}
            className={styles.result}
            extraStyle={{ textAlign: 'center', padding: '5px', fontSize: '15px' }}
          />
        </Modal>
      );
    }
    return null;
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      hideInfo: false,
    });
  };

  createLinkButton = () => {
    const { form, currentUser } = this.props;
    const { email: recruiterEmail } = currentUser;
    const { selectedRows, currentStep, hideInfo } = this.state;
    form.validateFields((err, data) => {
      if (err) return;
      let { email } = data;
      form.resetFields();
      if (!email) email = 'noEmailEntered';
      const shortList = { hideInfo, email, created_by: recruiterEmail, interviews: selectedRows };
      this.createLink(shortList);
      this.setState({ shareEmail: email, currentStep: currentStep + 1 });
    });
  };

  handleDone = () => {
    this.setState({ currentStep: 1 });
    this.handleModalVisible();
  };

  createLink(shortListJson) {
    const { dispatch } = this.props;
    dispatch({ type: 'rule/share', payload: shortListJson });
    this.setState({ hideInfo: false });
    message.success('Link Created!');
  }

  render() {
    const {
      rule: { data },
      dispatch,
      loading,
    } = this.props;

    const { selectedRows, currentStep } = this.state;

    return (
      <PageHeaderWrapper title="Candidates">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <ShareCandidateButton candidateData={selectedRows} />

                  <Button
                    type="danger"
                    onClick={() => {
                      showConfirm(dispatch, selectedRows, 'rule/removeCandidate', () =>
                        this.setState({ selectedRows: [] })
                      );
                    }}
                  >
                    Delete
                  </Button>
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
        {this.renderContent(currentStep)}
      </PageHeaderWrapper>
    );
  }
}

export default Candidates;
