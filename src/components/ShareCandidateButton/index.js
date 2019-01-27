import React from 'react';

import { Icon, Button, Row, Modal, Form, Input, Col, Checkbox, message } from 'antd';
import Result from '@/components/Result';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connect } from 'dva';

// import styles from './index.less';

const FormItem = Form.Item;

@connect(({ rule, user }) => ({
  currentUser: user.currentUser,
  rule,
}))
@Form.create()
class ShareCandidateButton extends React.Component {
  state = { currentStep: 1, hideInfo: false, modalVisible: false };

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

  handleDone = () => {
    this.setState({ currentStep: 1 });
    this.handleModalVisible();
  };

  handleModalVisible = flag => {
    const { modalVisible } = this.state;
    this.setState({ modalVisible: !modalVisible, hideInfo: false });
  };

  onCheckHideInfo = e => {
    this.setState({ hideInfo: e.target.checked });
  };

  createLinkButton = () => {
    const { candidateData, form, currentUser } = this.props;
    const { currentStep, hideInfo } = this.state;
    const { email: recruiterEmail } = currentUser;
    form.validateFields((err, data) => {
      if (err) return;
      let { email } = data;
      form.resetFields();
      if (!email) email = 'noEmailEntered';
      const shortList = { hideInfo, email, created_by: recruiterEmail, interviews: candidateData };
      this.createLink(shortList);
      this.setState({ shareEmail: email, currentStep: currentStep + 1 });
    });
  };

  createLink(shortListJson) {
    const { dispatch } = this.props;
    dispatch({ type: 'rule/share', payload: shortListJson });
    this.setState({ hideInfo: false });
    message.success('Link Created!');
  }

  renderCorrectModal = currentStep => {
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
            // className={styles.result}
            extraStyle={{ textAlign: 'center', padding: '5px', fontSize: '15px' }}
          />
        </Modal>
      );
    }
    return null;
  };

  render() {
    const { currentStep } = this.state;
    return (
      <div>
        {this.renderCorrectModal(currentStep)}{' '}
        <Button onClick={this.handleModalVisible} type="primary">
          Share Candidate
          <Icon type="share-alt" />
        </Button>
      </div>
    );
  }
}

export default ShareCandidateButton;
