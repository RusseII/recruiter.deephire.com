/* global $crisp */
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Alert, Button, Input, Typography } from 'antd';
import { connect } from 'dva';
import React, { Component, useState } from 'react';
import { lowerCaseQueryParams } from '@bit/russeii.deephire.utils.utils';
import { sendTgMsg, resetPassword, createCompany, getInviteById } from '@/services/api';

import Login from '@/components/Login';

import Auth from '../../Auth/Auth';
import styles from './Login.less';

const { Paragraph, Title } = Typography;

const ObjectID = require('bson-objectid');

const FormItem = Form.Item;

const { Tab, Email, Password, Submit, Company, Name } = Login;

const auth = new Auth();

const ForgotPassScreen = Form.create()(props => {
  const { setForgotPass, form } = props;
  const [resetResult, setResetResult] = useState();

  const returnToLoginButton = (
    <Button style={{ float: 'right' }} onClick={() => setForgotPass(false)} type="link">
      Return to Login
    </Button>
  );
  const submitResetPassword = event => {
    event.preventDefault();

    form.validateFields(async (err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      setResetResult(await resetPassword(fieldsValue.email));
    });
  };
  return (
    <div>
      {resetResult ? (
        <Alert style={{ marginBottom: 20 }} message={resetResult} type="success" />
      ) : (
        <div style={{ paddingBottom: 20, textAlign: 'center' }}>
          Enter your email below and we will send you a link to reset your password.
        </div>
      )}
      <Form onSubmit={submitResetPassword}>
        <FormItem>
          {form.getFieldDecorator('email', {
            rules: [
              { type: 'email', message: 'The input is not valid E-mail!' },
              {
                required: true,
                message: 'Please input your email address!',
              },
            ],
          })(<Input placeholder="Email Address" />)}
        </FormItem>
        <Button style={{ width: '100%' }} type="primary" onClick={submitResetPassword}>
          Send Reset Link
        </Button>
      </Form>
      {returnToLoginButton}
    </div>
  );
});
const { invited, signupemail: signupEmail } = lowerCaseQueryParams(window.location.search);

@connect(({ loading }) => ({
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: invited || signupEmail ? 'signUp' : 'account',
    forgotPassword: false,
    inviteData: null,
  };

  async componentDidMount() {
    // change this to get invite by ID
    if (invited) {
      const inviteData = await getInviteById(invited);
      this.setState({ inviteData });
      inviteData.company = inviteData.companyName;
      inviteData.email = inviteData.invitedEmail;

      this.setBaseInfo(inviteData);
    }
  }

  setBaseInfo = inviteData => {
    Object.keys(this.loginForm.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = inviteData[key] || null;
      this.loginForm.setFieldsValue(obj);
    });
  };

  onTabChange = type => {
    this.setState({ type });
  };

  setForgotPass(forgot) {
    this.setState({ forgotPassword: forgot });
  }

  handleSubmit = () => {
    this.loginForm.validateFields((err, values) => {
      if (!err) {
        const { type } = this.state;

        if (type === 'account') {
          auth.login(values.email, values.password);
        } else {
          const { inviteData } = this.state;
          let _id;
          let role = 'admin';
          let team;
          if (inviteData) {
            _id = ObjectID(inviteData.companyId);
            // eslint-disable-next-line prefer-destructuring
            role = inviteData.role;
            // eslint-disable-next-line prefer-destructuring
            team = inviteData.team?.toString();
          } else {
            _id = ObjectID();
            const companyData = { _id, owner: values.email, companyName: values.company };
            createCompany(companyData);
            sendTgMsg({ event: 'signup', email: values.email, companyName: values.company });
          }

          $crisp.push([
            'set',
            'session:event',
            [[['user-signup', { time: new Date().toString() }, 'green']]],
          ]);

          auth.signup(values.email, values.password, values.name, {
            company: values.company,
            companyId: _id,
            role,
            team,
          });
        }
      }
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting } = this.props;
    const { type, forgotPassword, inviteData } = this.state;
    const { createdByName = '', companyName = '' } = inviteData || {};
    return (
      <div className={styles.main}>
        {!forgotPassword ? (
          <Login
            defaultActiveKey={type}
            onTabChange={this.onTabChange}
            onSubmit={this.handleSubmit}
            ref={form => {
              this.loginForm = form;
            }}
          >
            <Tab key="account" tab="Login">
              {/* <LinkedInLoginButton align="center" size={40} onClick={auth.loginWithLinkedin}>
                <span style={{ marginLeft: -18 }}>Login with Linkedin</span>
              </LinkedInLoginButton>
              <Divider>or</Divider> */}

              <Email name="email" placeholder="company email" defaultValue={signupEmail} />
              <Password
                name="password"
                placeholder="password"
                onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
              />
            </Tab>

            <Tab key="signUp" tab="Sign Up">
              {invited ? (
                <InvitedText createdByName={createdByName} companyName={companyName} />
              ) : (
                <DefaultText />
              )}
              {type === 'signUp' && (
                <>
                  <Name name="name" placeholder="full name" />
                  <Company disabled={Boolean(invited)} name="company" placeholder="company" />
                </>
              )}
              <Email
                disabled={Boolean(invited)}
                name="email"
                placeholder="company email"
                defaultValue={signupEmail}
              />
              <Password
                name="password"
                placeholder="password"
                onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
              />
            </Tab>

            <Submit style={{ marginTop: -24, marginBottom: 0 }} loading={submitting}>
              {type === 'account' ? 'Login' : 'Sign up'}
            </Submit>
            <Button style={{ float: 'right' }} onClick={() => this.setForgotPass(true)} type="link">
              Forgot Password
            </Button>
            {/* </div> */}
          </Login>
        ) : (
          <ForgotPassScreen setForgotPass={() => this.setForgotPass()} />
        )}
      </div>
    );
  }
}

const InvitedText = ({ createdByName, companyName }) => (
  <>
    <Title style={{ textAlign: 'center' }} level={3}>
      You&apos;ve Been Invited
    </Title>
    <Paragraph style={{ textAlign: 'center', paddingBottom: 10 }}>
      {`${createdByName} has invited you to join ${companyName}`}
    </Paragraph>
  </>
);

const DefaultText = () => (
  <>
    <Title style={{ textAlign: 'center' }} level={3}>
      Create Your Account & Start Interviewing
    </Title>
    <Paragraph style={{ textAlign: 'center', paddingBottom: 10 }}>
      You are a few clicks away from creating your first interview
    </Paragraph>
  </>
);
export default LoginPage;
