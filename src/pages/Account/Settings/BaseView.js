import React, { Component, Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Upload } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';

const FormItem = Form.Item;

const AvatarView = ({ picture }) => (
  <Fragment>
    <div className={styles.avatar_title}>Avatar</div>
    <div className={styles.avatar}>
      <img src={picture} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view} />
    </Upload>
  </Fragment>
);

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class BaseView extends Component {
  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.picture) {
      return currentUser.picture;
    }
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  getViewDom = ref => {
    this.view = ref;
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label={formatMessage({ id: 'app.settings.basic.email' })}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.email-message' }, {}),
                  },
                ],
              })(<Input disabled />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input disabled />)}
            </FormItem>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView picture={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default BaseView;
