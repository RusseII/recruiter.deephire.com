import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
import Auth from '../../Auth/Auth';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    const auth = new Auth(this.props);
    // auth.loginWithGoogle();
    // console.log(values)
    // auth.login(values.userName, values.password);
    const { type } = this.state;
    // if (!err) {
    //   const { dispatch } = this.props;
    //   dispatch({
    //     type: 'login/login',
    //     payload: {
    //       ...values,
    //       type,
    //     },
    //   });
    // }
  };

  handleSignUp = (err, values) => {
    const auth = new Auth(this.props);
    // auth.loginWithGoogle();
    // console.log(values)
    console.log(values);
    auth.signup(values.userName, values.password);
    const { type } = this.state;
    // if (!err) {
    //   const { dispatch } = this.props;
    //   dispatch({
    //     type: 'login/login',
    //     payload: {
    //       ...values,
    //       type,
    //     },
    //   });
    // }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSignUp}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="Log In">
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage('账户或密码错误（admin/888888）')}
            <UserName name="userName" placeholder="username" />
            <Password
              name="password"
              placeholder="password"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>
          <Tab key="signUp" tab="Sign Up">
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage('账户或密码错误（admin/888888）')}
            <UserName name="userName" placeholder="username" />
            <Password
              name="password"
              placeholder="password"
              onPressEnter={() => this.loginForm.validateFields(this.handleSignUp)}
            />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              Remember me
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              Forgot password
            </a>
          </div>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            Or Login With
            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
            <Link className={styles.register} to="/User/Register">
              Signup
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
