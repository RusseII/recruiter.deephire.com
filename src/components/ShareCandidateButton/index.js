import React from 'react';

import { Row, Modal, Form, Input, Col, Checkbox } from 'antd';

const FormItem = Form.Item;

// createLink(shortListJson) {
//     const { dispatch } = this.props;
//     dispatch({ type: 'rule/share', payload: shortListJson });
//     this.setState({ hideInfo: false });
//     message.success('Link Created!');
// }

const createLinkButton = props => {
  const { form, currentUser } = this.props;
  const { email: recruiterEmail } = currentUser;
  const { candidateData, currentStep, hideInfo } = this.state;
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

const RenderCorrectModal = Form.create()(props => {
  const { currentStep, shareEmail, modalVisible, form } = props;

  if (currentStep === 1) {
    return (
      <Modal
        destroyOnClose
        title="Create Shareable Link"
        visible={modalVisible}
        onOk={createLinkButton(props)}
        okText="Create Link"
        // onCancel={() => handleModalVisible()}
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
            {/* <Checkbox onChange={onCheckHideInfo}>Hide Candidate Info</Checkbox> */}
          </Col>
        </Row>
      </Modal>
    );
  }
  // if (currentStep === 2) {
  //     return (
  //       <Modal
  //         destroyOnClose
  //         title="Create Shareable Link"
  //         visible={modalVisible}
  //         onOk={() => this.handleDone()}
  //         okText="Done"
  //         onCancel={() => this.handleDone()}
  //       >
  //         <Result
  //           type="success"
  //           title="Share Link Created!"
  //           description={`Send this link to ${shareEmail}`}
  //           extra={this.information(shareLink, 'russell@deephire.com')}
  //           className={styles.result}
  //       extraStyle={{ textAlign: 'center', padding: '5px', fontSize: '15px' }}
  //     />
  //   </Modal>
  // );
  // }
  return null;
});

// information = shareLink => (
//   <div>
//     <Row>
//       <Col xs={24} sm={24}>
//         {`${shareLink}     `}
//         <CopyToClipboard text={shareLink}>
//           <Button size="small" icon="copy" />
//         </CopyToClipboard>
//       </Col>
//     </Row>
//     <br />
//   </div>
// );

// handleDone = () => {
//     this.setState({ currentStep: 1 });
//     this.handleModalVisible();
// };

// handleModalVisible = flag => {
//     this.setState({
//         modalVisible: !!flag,
//         hideInfo: false,
//     });
// };

// onCheckHideInfo = e => {
//     this.setState({ hideInfo: e.target.checked });
// };

class ShareCandidateButton extends React.Component {
  render() {
    const currentStep = 1;
    return (
      <div>
        <RenderCorrectModal currentStep={1} shareEmail="roo" modalVisible />
      </div>
    );
  }
}

export default ShareCandidateButton;
