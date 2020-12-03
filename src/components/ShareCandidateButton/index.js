import React from 'react';

import { CopyOutlined, ShareAltOutlined, InfoCircleOutlined } from '@ant-design/icons';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Tooltip, Button, Row, Modal, Input, Col, Checkbox, message } from 'antd';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connect } from 'dva';
import { getHttpUrl } from '@bit/russeii.deephire.utils.utils';
import Result from '@/components/Result';
import GlobalContext from '@/layouts/MenuContext';

const FormItem = Form.Item;

@connect(({ rule, user }) => ({
  currentUser: user.currentUser,
  rule,
}))
@Form.create()
class ShareCandidateButton extends React.Component {
  state = { currentStep: 1, hideInfo: true, modalVisible: false, requireName: true };

  information = shareLink => (
    <div>
      <Row>
        <Col xs={24} sm={24}>
          <Tooltip title="Click to copy">
            <CopyToClipboard
              text={getHttpUrl(shareLink)}
              onCopy={() => message.success('Link Copied')}
            >
              <a>{`${shareLink}     `}</a>
            </CopyToClipboard>

            <CopyToClipboard
              text={getHttpUrl(shareLink)}
              onCopy={() => message.success('Link Copied')}
            >
              <Button size="small" icon={<CopyOutlined />} />
            </CopyToClipboard>
          </Tooltip>
        </Col>
      </Row>
      <br />
    </div>
  );

  handleDone = () => {
    this.setState({ currentStep: 1 });
    this.handleModalVisible();
  };

  handleModalVisible = () => {
    const { setControlKeys } = this.props;
    const { modalVisible } = this.state;
    if (setControlKeys) {
      setControlKeys(modalVisible);
    }
    this.setState({ modalVisible: !modalVisible, hideInfo: false });
  };

  onCheckHideInfo = e => {
    this.setState({ hideInfo: e.target.checked });
  };

  onCheckRequireName = e => {
    this.setState({ requireName: e.target.checked });
  };

  createLinkButton = () => {
    const { candidateData, form } = this.props;
    const { currentStep, hideInfo, requireName } = this.state;
    const {
      recruiterProfile: {
        app_metadata: { team },
      },
    } = this.context;
    form.validateFields((err, data) => {
      if (err) return;
      const { description, name } = data;
      form.resetFields();
      const shortList = {
        description,
        name,
        hideInfo,
        requireName,
        interviews: candidateData,
        createdByTeam: team,
      };
      this.createLink(shortList);
      this.setState({ shareName: name, currentStep: currentStep + 1 });
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
    const { shareName, modalVisible } = this.state;

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
            {form.getFieldDecorator('name', {})(<Input placeholder="Share Link Name" />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Description">
            {form.getFieldDecorator('description', {})(
              <Input placeholder="Description of what the sharelink is for" />
            )}
          </FormItem>

          {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Email">
            {form.getFieldDecorator('email', {})(
              <Input placeholder="Who do you want to share this with?" />
            )}
          </FormItem> */}
          <Row gutter={0}>
            <Col span={5} />
            <Col span={15}>
              <div>
                <Checkbox
                  defaultChecked
                  style={{ marginBottom: 8 }}
                  onChange={this.onCheckRequireName}
                >
                  Require name
                </Checkbox>
                <Tooltip title="Requires anyone viewing the share link to enter their name. This allows you to share the link with multiple people, and get individual feedback and analytics for each person.">
                  <InfoCircleOutlined />
                </Tooltip>
              </div>
              <div>
                <Checkbox defaultChecked onChange={this.onCheckHideInfo}>
                  Hide candidate info
                </Checkbox>
              </div>
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
            description={`Send this link to ${shareName}`}
            extra={this.information(shareLink, 'russell@deephire.com')}
            extraStyle={{ textAlign: 'center', padding: '5px', fontSize: '15px' }}
          />
        </Modal>
      );
    }
    return null;
  };

  static contextType = GlobalContext;

  render() {
    const { currentStep } = this.state;
    const { isDisabled, buttonText } = this.props;
    return (
      <>
        {this.renderCorrectModal(currentStep)}
        <Button
          disabled={isDisabled}
          onClick={this.handleModalVisible}
          type="primary"
          {...this.props}
        >
          {buttonText || 'Share Candidates'}

          <ShareAltOutlined />
        </Button>
      </>
    );
  }
}

export default ShareCandidateButton;
