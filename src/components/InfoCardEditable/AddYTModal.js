import React from 'react';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Modal, Input } from 'antd';

const FormItem = Form.Item;

const AddYTModal = Form.create()(props => {
  const { form, toggle, visable, addYouTubeLink } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      addYouTubeLink(fieldsValue.youtubeLink);
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Youtube Link">
        {form.getFieldDecorator('youtubeLink', {})(<Input placeholder="YouTube Link" />)}
      </FormItem>
    </Modal>
  );
});

export default AddYTModal;
