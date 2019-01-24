import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Divider, InputNumber, Icon } from 'antd';
import styles from './style.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
    md: { span: 10 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 14, offset: 8 },
    md: { span: 10, offset: 8 },
  },
};
let uuid = 1;

const remove = (form, k) => {
  const keys = form.getFieldValue('keys');
  if (keys.length === 1) {
    return;
  }

  form.setFieldsValue({
    keys: keys.filter(key => key !== k),
  });
};

const createFormItems = props => {
  const { form } = props;
  const { getFieldDecorator, getFieldValue } = form;

  getFieldDecorator('keys', { initialValue: [0] });
  const keys = getFieldValue('keys');
  const formItems = keys.map((k, index) => (
    <FormItem
      style={{ width: '100%' }}
      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
      label={index === 0 ? 'Questions' : ''}
      required={false}
      key={k}
    >
      {getFieldDecorator(`interviewQuestions[${k}]`, {
        validateTrigger: ['onChange', 'onBlur'],
        rules: [
          {
            required: true,
            whitespace: true,
            message: 'Please input interview question or delete this field.',
          },
        ],
      })(
        <Input
          style={{ width: '90%', marginRight: 8 }}
          placeholder={`Interview Question ${index + 1}`}
        />
      )}
      {keys.length > 1 ? (
        <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          disabled={keys.length === 1}
          onClick={() => remove(form, k)}
        />
      ) : null}
    </FormItem>
  ));
  return formItems;
};

@connect(({ form, loading, user }) => ({
  currentUser: user.currentUser,
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,
}))
@Form.create()
class Step1 extends React.PureComponent {
  state = { loading: false };

  enterLoading = () => {
    this.setState({ loading: true });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid += 1;
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  onValidateForm = e => {
    const { form, dispatch, data, currentUser } = this.props;
    const { email } = currentUser;
    const { validateFields } = form;

    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        this.enterLoading();
        dispatch({
          type: 'form/submitStepForm',
          payload: {
            ...data,
            ...values,
            email,
          },
        });
      }
    });
  };

  render() {
    const { form } = this.props;
    const { loading } = this.state;
    const { getFieldDecorator } = form;

    return (
      <Fragment>
        <Form
          layout="horizontal"
          hideRequiredMark
          onSubmit={this.onValidateForm}
          style={{ marginTop: 20 }}
        >
          <FormItem {...formItemLayout} label="Name">
            {getFieldDecorator('interviewName', {
              rules: [
                {
                  required: true,
                  message: 'What should this interview be called?',
                  whitespace: true,
                },
              ],
            })(<Input style={{ width: '90%', marginRight: 8 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Retakes">
            {getFieldDecorator('retakesAllowed', {
              initialValue: 8,
            })(<InputNumber min={0} max={100} />)}
            <span className="ant-form-text"> per interview</span>
          </FormItem>

          <FormItem {...formItemLayout} label="Prep Time">
            {getFieldDecorator('prepTime', {
              initialValue: 45,
            })(<InputNumber min={15} max={1000} />)}
            <span className="ant-form-text"> seconds per question</span>
          </FormItem>

          <FormItem {...formItemLayout} label="Record Time">
            {getFieldDecorator('answerTime', {
              initialValue: 90,
            })(<InputNumber min={15} max={1000} />)}
            <span className="ant-form-text"> seconds per question</span>
          </FormItem>
          {createFormItems(this.props)}

          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add}>
              <Icon type="plus" /> Add Interview Question
            </Button>
          </FormItem>
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button loading={loading} type="primary" htmlType="submit">
              Create Interview
            </Button>
          </FormItem>
        </Form>

        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>Other Info</h3>
          <h4>The Process</h4>
          <p>
            Use this page to create an interview. After you submit, you will receive an interview
            link.
          </p>
          <h4>Next</h4>
          <p>
            Send the link out to candidates, once they complete their interview, you will receive an
            email with their videos.
          </p>
        </div>
      </Fragment>
    );
  }
}

export default Step1;
