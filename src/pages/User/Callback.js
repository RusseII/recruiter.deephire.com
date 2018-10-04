import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import Auth from '../../Auth/Auth';

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class Callback extends Component {
  componentDidMount() {
    this.handleAuthentication(this.props);
  }

  handleAuthentication = props => {
    const auth = new Auth(props);
    if (/access_token|id_token|error/.test(props.location.hash)) {
      auth.handleAuthentication();
    }
  };

  render() {
    return (
      <Spin spinning>
        <p>&nbsp;</p>
      </Spin>
    );
  }
}
export default Callback;
