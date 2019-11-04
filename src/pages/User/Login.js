import { Alert, Button, Form, Input, Divider } from 'antd';
import { LinkedInLoginButton } from 'react-social-login-buttons';
import { connect } from 'dva';
import React, { Component, useState } from 'react';

import Login from '@/components/Login';
import { resetPassword } from '@/services/api';

import Auth from '../../Auth/Auth';
import styles from './Login.less';

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
@connect(({ loading }) => ({
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    forgotPassword: false,
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
          auth.signup(values.email, values.password, values.name, values.company);
        }
      }
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting } = this.props;
    const { type, forgotPassword } = this.state;
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
              <LinkedInLoginButton align="center" size={40} onClick={auth.loginWithLinkedin}>
                <span style={{ marginLeft: -18 }}>Login with Linkedin</span>
              </LinkedInLoginButton>
              <Divider>or</Divider>

              <Email name="email" placeholder="email" />
              <Password
                name="password"
                placeholder="password"
                onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
              />
            </Tab>
            <Tab key="signUp" tab="Sign up">
              <Name name="name" placeholder="name" />
              <Company name="company" placeholder="company" />
              <Email name="email" placeholder="email" />
              <Password
                name="password"
                placeholder="password"
                onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
              />
            </Tab>

            <Submit style={{ marginTop: -24 }} loading={submitting}>
              {type === 'account' ? 'Login' : 'Sign up'}
            </Submit>
            <div className={styles.other}>
              {type === 'account' && (
                <>
                  Or Login With
                  <Button
                    onClick={auth.loginWithGoogle}
                    shape="circle"
                    size="medium"
                    icon="google"
                    style={{ marginLeft: 16 }}
                  />
                  <Button
                    onClick={auth.loginWithFacebook}
                    shape="circle"
                    size="medium"
                    icon="facebook"
                    style={{ marginLeft: 16 }}
                  />
                </>
              )}
              <Button
                style={{ float: 'right' }}
                onClick={() => this.setForgotPass(true)}
                type="link"
              >
                Forgot Password
              </Button>
            </div>
          </Login>
        ) : (
          <ForgotPassScreen setForgotPass={() => this.setForgotPass()} />
        )}
      </div>
    );
  }
}

export default LoginPage;
