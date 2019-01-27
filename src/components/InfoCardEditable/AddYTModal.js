import React from 'react';

import { Modal, Input, Form } from 'antd';

const FormItem = Form.Item;

const AddYTModal = Form.create()(props => {
  const { form, toggle, visable, addYouTubeLink } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      addYouTubeLink(fieldsValue.youTubeLink);
      toggle();
    });
  };
  return (
    <Modal
      okText="Add"
      destroyOnClose
      title="Add YouTube Link"
      visible={visable}
      onCancel={toggle}
      onOk={okHandle}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Yoube Link">
        {form.getFieldDecorator('youTubeLink', {})(<Input placeholder="YouTube Link" />)}
      </FormItem>
    </Modal>
  );
});

export default AddYTModal;
