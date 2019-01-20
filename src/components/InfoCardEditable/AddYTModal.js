import React from 'react';

import { Modal, Input, Form } from 'antd';

const FormItem = Form.Item;

const AddYTModal = Form.create()(props => {
  const { toggle, visable, form } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      okText="Add"
      destroyOnClose
      title="Add Youtube Link"
      visible={visable}
      onCancel={toggle}
      onOk={okHandle}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="YouTube Link">
        {<Input placeholder="YouTube Link" />}
      </FormItem>
    </Modal>
  );
});

export default AddYTModal;
