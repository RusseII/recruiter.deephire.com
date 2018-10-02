import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Checkbox, Alert, Icon, Button } from 'antd';
import Login from '@/components/Login';
import GoogleButton from 'react-google-button'
import { formatMessage, FormattedMessage } from 'umi/locale';
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



  invalidLogin(status)  {
    console.log(status)
    if (status == "Invalid") {
      this.renderMessage('Invalid Email or Password')
    }
    
  }

  loginWithGoogle() {
    const auth = new Auth();
    auth.loginWithGoogle()
    console.log("liwg")

  }

  loginWithLinkedin() {
    const auth = new Auth();
    auth.loginWithLinkedin()
    console.log("liwg")

  }


  loginWithFacebook() {
    const auth = new Auth();
    auth.loginWithFacebook()
    console.log("liwg")

  }

  handleSubmit = (err, values) => {
    

    this.loginForm.validateFields((err, values) => {
      
      if (!err) {
        this.renderMessage('Invalid Email or Password')


        console.log("submitted")
        const auth = new Auth(this.props);
    
        const { type } = this.state;
    
        if (type === "account") {
            const status = auth.login(values.email, values.password) ;
          
            
    
        }
    
        else {
          auth.signup(values.email, values.password);
    
        }
        this.setState({ status: "error" });

      }
    });
  }

  
  //   console.log(type)
    
  // };


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
    console.log(this.type)
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

         

          {this.state.status === 'error' &&
              
              
              this.renderMessage('Invalid Email or Password')}
          <Tab key="account" tab="Log In">
            <UserName name="email" placeholder="username" />
            <Password
              name="password"
              placeholder="password"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>
          <Tab key="signUp" tab="Sign Up">
            <UserName name="email" placeholder="username" />
            <Password
              name="password"
              placeholder="password"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
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
          
          <Submit loading={submitting}>{this.state.type === 'account' ? "Log in": "Sign up"}</Submit>
          <div className={styles.other}>
            {this.state.type === 'account' ? "Or Login With" : "Or Signup With"}
            <Button onClick={this.loginWithGoogle} shape="circle" size="large" icon="google" style={{marginLeft: 16}} />
            <Button onClick={this.loginWithLinkedin} shape="circle" size="large" icon="linkedin" style={{marginLeft: 16}} />
            <Button onClick={this.loginWithFacebook} shape="circle" size="large" icon="facebook" style={{marginLeft: 16}} />

         
          </div>
        </Login>

        
      </div>
    );
  }
}

export default LoginPage;
