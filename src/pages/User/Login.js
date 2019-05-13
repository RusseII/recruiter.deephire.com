import Login from '@/components/Login';
import { sendEmail } from '@/services/api';
import { Alert, Button } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';
import Auth from '../../Auth/Auth';
import styles from './Login.less';

const { Tab, UserName, Password, Submit } = Login;

const auth = new Auth();

@connect(({ loading }) => ({
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    if (values.email !== 'demo@deephire.com') {
      sendEmail({
        recipients: ['russell@deephire.com'],
        subject: `${values.email} tried to login`,
        message: values.email,
      });
    }
    this.loginForm.validateFields((err, values) => {
      if (!err) {
        const { type } = this.state;

        if (type === 'account') {
          auth.login(values.email, values.password);
        } else {
          auth.signup(values.email, values.password);
        }
      }
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="Log In">
            <UserName name="email" placeholder="email" />
            <Password
              name="password"
              placeholder="password"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>
          <Tab key="signUp" tab="Sign Up">
            <UserName name="email" placeholder="email" />
            <Password
              name="password"
              placeholder="password"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>
          <div>
            {/* <a style={{ float: 'right' }} href="">
              Forgot password
            </a> */}
          </div>

          <Submit loading={submitting}>{type === 'account' ? 'Log in' : 'Sign up'}</Submit>
          <div className={styles.other}>
            {type === 'account' ? 'Or Login With' : 'Or Signup With'}
            <Button
              onClick={auth.loginWithGoogle}
              shape="circle"
              size="large"
              icon="google"
              style={{ marginLeft: 16 }}
            />
            <Button
              onClick={auth.loginWithLinkedin}
              shape="circle"
              size="large"
              icon="linkedin"
              style={{ marginLeft: 16 }}
            />
            <Button
              onClick={auth.loginWithFacebook}
              shape="circle"
              size="large"
              icon="facebook"
              style={{ marginLeft: 16 }}
            />
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
