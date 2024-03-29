import React, { useEffect, useState } from 'react';

import {
  CheckCircleTwoTone,
  DeleteOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Input, Card, Button, Alert, Col, Drawer, Popconfirm, Skeleton, message } from 'antd';
import { connect } from 'dva';
import { updateCompany } from '@/services/api';
import { useCompanyInfo } from '@/services/complexHooks';

const { Meta } = Card;

const BaseView = () => {
  const [flag, setFlag] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const companyData = useCompanyInfo(flag);
  const { clockworkIntegration } = companyData || {};

  const deleteClockworkIntegration = () => {
    updateCompany({ clockworkIntegration: null });
    setFlag(flag => !flag);
  };

  const actions = [<SettingOutlined key="setting" onClick={() => setDrawer('clockwork')} />];
  if (clockworkIntegration) {
    actions.push(
      <Popconfirm
        title="Delete Integration? "
        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        onConfirm={() => deleteClockworkIntegration()}
      >
        <DeleteOutlined key="delete" />
      </Popconfirm>
    );
  }
  return (
    <>
      <Drawer
        title="Clockwork Integration"
        placement="right"
        closable
        width={512}
        onClose={() => setDrawer(false)}
        visible={drawer === 'clockwork'}
      >
        <GiveApiKey
          setDrawer={setDrawer}
          setFlag={setFlag}
          clockworkIntegration={clockworkIntegration}
        />
      </Drawer>

      <Card
        style={{ width: 300 }}
        cover={
          <img
            style={{ padding: 40, backgroundColor: 'rgb(240, 242, 245)' }}
            alt="Clockwork"
            src="https://www.clockworkrecruiting.com/hs-fs/hubfs/Clockwork%20LP%202018%20Images/clockwork-logo-img-1.png?width=702&name=clockwork-logo-img-1.png"
          />
        }
        actions={actions}
      >
        <Skeleton paragraph={{ rows: 2 }} active loading={!companyData}>
          <Meta
            title={
              clockworkIntegration ? (
                <div style={{ color: '#52c41a' }}>
                  <CheckCircleTwoTone twoToneColor="#52c41a" /> Clockwork
                </div>
              ) : (
                'Clockwork'
              )
            }
            description="Automatically keep track of your video interviews inside of Clockwork's software."
          />
        </Skeleton>
      </Card>
    </>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(BaseView);

const description = (
  <div>
    <div>
      The Clockwork integration automatically updates the status of your candidates inside of
      Clockwork. When a candidate starts or completes an interview, a note is added for that
      candidate in Clockwork.
    </div>

    <br />
    <div>
      You need to get an API key from Clockwork to configure this. -{' '}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://help.deephire.com/en/article/deephire-clockwork-integration-tt2laq/"
      >
        Check the tutorial to setup DeepHire with Clockwork
      </a>
    </div>
  </div>
);

const GiveApiKey = Form.create()(props => {
  const { clockworkIntegration, setFlag, setDrawer } = props;
  const { getFieldDecorator, getFieldsValue, setFieldsValue } = props.form;

  const okHandle = e => {
    e.preventDefault();

    props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { apiKey, apiSecret, firmKey, firmName } = fieldsValue;

      updateCompany({ clockworkIntegration: { apiKey, apiSecret, firmKey, firmName } });
      message.success('Succesully Integrated with Clockwork');
      setFlag(flag => !flag);
      setDrawer(false);
    });
  };

  const setBaseInfo = () => {
    if (clockworkIntegration) {
      Object.keys(getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = clockworkIntegration[key] || null;
        setFieldsValue(obj);
      });
    }
  };
  useEffect(() => setBaseInfo(), []);

  return (
    <div style={{ paddingTop: 12 }}>
      <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} onSubmit={okHandle}>
        <Form.Item label="API Key">
          {getFieldDecorator('apiKey', {
            rules: [{ required: false, message: 'Please enter API Key' }],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="API Secret">
          {getFieldDecorator('apiSecret', {
            rules: [{ required: false, message: 'Please enter API Secret' }],
          })(<Input type="password" />)}
        </Form.Item>

        <Form.Item label="Firm Service Key">
          {getFieldDecorator('firmKey', {
            rules: [{ required: false, message: 'Please enter Firm Service Key' }],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Firm Name">
          {getFieldDecorator('firmName', {
            rules: [{ required: false, message: 'Please enter the Firm Name' }],
          })(<Input />)}
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12 }}>
          <Button type="primary" htmlType="submit">
            Connect to Clockwork
          </Button>
        </Form.Item>
      </Form>

      <Col span={24}>
        <Alert
          message="How does the Clockwork integration work?"
          description={description}
          type="info"
        />
      </Col>
    </div>
  );
});
