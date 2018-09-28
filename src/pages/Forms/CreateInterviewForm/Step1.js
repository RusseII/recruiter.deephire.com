import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Divider, InputNumber, Icon } from 'antd';
import router from 'umi/router';
import styles from './style.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 5 },
  },
};
let uuid = 1;

@connect(({ form }) => ({
  data: form.step,
}))
@Form.create()
class Step1 extends React.PureComponent {
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid+= 1;
    // var nextKeys = nextKeys.concat(uuid);
    //     uuid++;
    console.log(nextKeys);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let { prepTime, retakesAllowed, answerTime, interviewName, interviewQuestions } = values;
        interviewQuestions = interviewQuestions.map(a => ({
          question: a,
        }));
        console.log('Received values of form: ', values);

        const dateTime = Date.now();
        const timestamp = Math.floor(dateTime / 1000);
        const { email } = JSON.parse(localStorage.getItem('user_profile'));
        console.log('email is', email);

        const data = {
          interviewName,
          email,
          interview_questions: interviewQuestions,
          interview_config: { retakesAllowed, prepTime, answerTime },
          timestamp,
        };

        fetch(`${ApiHostedURL}/v1.0/create_interview`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(data => history.push(`/showInterviewLink/${encodeURIComponent(data)}`))

          .catch(err => console.log('err', err));
      }
    });
  };

  login() {
    this.props.auth.login();
  }
  // handleSubmit = e => {
  //   const { dispatch, form } = this.props;
  //   e.preventDefault();
  //   form.validateFieldsAndScroll((err, values) => {
  //     if (!err) {
  //       dispatch({
  //         type: 'form/submitRegularForm',
  //         payload: values,
  //       });
  //     }
  //   });
  // };

  render() {
    const { form, dispatch, data } = this.props;
    const { getFieldDecorator, validateFields, getFieldValue } = form;

    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'form/saveStepFormData',
            payload: values,
          });
          router.push('/form/create-interview/result');
        }
      });
    };

    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <FormItem
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
        })(<Input placeholder={`Interview Question ${  index + 1}`} />)}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            disabled={keys.length === 1}
            onClick={() => this.remove(k)}
          />
        ) : null}
        {/* <Input placeholder="Interview Question" style={{ width: "60%", marginRight: 8 }} /> */}
      </FormItem>
    ));
    return (
      <Fragment>
        <Form
          layout="horizontal"
          className={styles.stepForm}
          hideRequiredMark
          onSubmit={this.handleSubmit}
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
            })(<Input />)}
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
          {formItems}
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add}>
              <Icon type="plus" /> Add Interview Question
            </Button>
          </FormItem>
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="primary" htmlType="submit">
              Create Interview
            </Button>
          </FormItem>
        </Form>
        {/* <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="付款账户">
            {getFieldDecorator('payAccount', {
              initialValue: data.payAccount,
              rules: [{ required: true, message: '请选择付款账户' }],
            })(
              <Select placeholder="test@example.com">
                <Option value="ant-design@alipay.com">ant-design@alipay.com</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="收款账户">
            <Input.Group compact>
              <Select defaultValue="alipay" style={{ width: 100 }}>
                <Option value="alipay">支付宝</Option>
                <Option value="bank">银行账户</Option>
              </Select>
              {getFieldDecorator('receiverAccount', {
                initialValue: data.receiverAccount,
                rules: [
                  { required: true, message: '请输入收款人账户' },
                  { type: 'email', message: '账户名应为邮箱格式' },
                ],
              })(<Input style={{ width: 'calc(100% - 100px)' }} placeholder="test@example.com" />)}
            </Input.Group>
          </Form.Item>
          <Form.Item {...formItemLayout} label="收款人姓名">
            {getFieldDecorator('receiverName', {
              initialValue: data.receiverName,
              rules: [{ required: true, message: '请输入收款人姓名' }],
            })(<Input placeholder="请输入收款人姓名" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="转账金额">
            {getFieldDecorator('amount', {
              initialValue: data.amount,
              rules: [
                { required: true, message: '请输入转账金额' },
                {
                  pattern: /^(\d+)((?:\.\d+)?)$/,
                  message: '请输入合法金额数字',
                },
              ],
            })(<Input prefix="￥" placeholder="请输入金额" />)}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form> */}
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>Other Info</h3>
          <h4>The Process</h4>
          <p>
            First, create an interview. Next you will send out this interview to job seekers. Good
            luck.
          </p>
          <h4>转账到银行卡</h4>
          <p>
            如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
          </p>
        </div>
      </Fragment>
    );
  }
}

export default Step1;