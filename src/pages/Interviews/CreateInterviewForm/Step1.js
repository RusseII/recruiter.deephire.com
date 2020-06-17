import React, { Fragment } from 'react';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Input, Button, Divider, InputNumber, Result, Select } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './style.less';
import GlobalContext from '@/layouts/MenuContext';
import { getInterviews, getCompany } from '@/services/api';
import { getAuthority } from '@/utils/authority';
import UpgradeButton from '@/components/Upgrade/UpgradeButton';

const isAdmin = () => JSON.stringify(getAuthority()) === JSON.stringify(['admin']);

const FormItem = Form.Item;
const { Option } = Select;

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

const formItemLayoutHidden = {
  style: { display: 'none' },
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

const drawerLayout = {
  wrapperCol: 24,
};

let uuid = 100;

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
  const { form, data } = props;
  const { interviewQuestions } = data || {};
  const { getFieldDecorator, getFieldValue } = form;

  getFieldDecorator('keys', {
    initialValue: interviewQuestions ? [...Array(interviewQuestions.length).keys()] : [0],
  });
  const keys = getFieldValue('keys');

  const getLayout = index => {
    if (index === 0) {
      return data ? drawerLayout : formItemLayout;
    }
    return data ? drawerLayout : formItemLayoutWithOutLabel;
  };
  const formItems = keys.map((k, index) => (
    <FormItem
      style={{ width: '100%' }}
      {...getLayout(index)}
      label={index === 0 ? 'Questions' : ''}
      required={false}
      key={k}
    >
      {getFieldDecorator(`interviewQuestions[${k}]`, {
        initialValue:
          interviewQuestions && interviewQuestions[k] ? interviewQuestions[k].question : null,
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
        <MinusCircleOutlined
          className="dynamic-delete-button"
          disabled={keys.length === 1}
          onClick={() => remove(form, k)}
        />
      ) : null}
    </FormItem>
  ));
  return formItems;
};

@Form.create()
class Step1 extends React.PureComponent {
  state = { loading: false };
  // this.props.data

  async componentDidMount() {
    const { data } = this.props;
    const companyData = await getCompany();
    this.setState({ companyTeams: companyData?.teams });
    if (!data) {
      const { setInterviews } = this.context;
      setInterviews(await getInterviews());
    }
  }

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
    const { form, dispatch, data, onClick, setReload } = this.props;
    const { validateFields } = form;
    const {
      recruiterProfile: {
        app_metadata: { team },
      },
    } = this.context;

    e.preventDefault();
    validateFields(async (err, values) => {
      if (!err) {
        // sometimes there was null values inside the array, which broke everything
        const cleanedValueData = { createdByTeam: team, ...values };
        cleanedValueData.interviewQuestions = values.interviewQuestions.filter(
          value => value != null
        );

        this.enterLoading();
        if (data && onClick) {
          await onClick(cleanedValueData);
          this.setState({ loading: false });
          setReload(flag => !flag);
        }
        if (!data) {
          dispatch({
            type: 'form/submitStepForm',
            payload: {
              ...cleanedValueData,
            },
          });
        }
      }
    });
  };

  static contextType = GlobalContext;

  render() {
    const { form, data } = this.props;
    const { interviewConfig = {}, interviewName, createdByTeam } = data || {};
    const { loading, companyTeams } = this.state;
    const { getFieldDecorator } = form;
    const { interviews, stripeProduct } = this.context;
    const { allowedInterviews } = stripeProduct.metadata || {};

    // TODO fix bug where the "cant create interview" is shown for a second in edit interview
    if (interviews.length >= allowedInterviews && !data) {
      return <CantCreateInterview />;
    }
    return (
      <Fragment>
        <Form
          layout="horizontal"
          hideRequiredMark
          onSubmit={this.onValidateForm}
          style={{ marginTop: data ? 0 : 24 }}
        >
          {companyTeams && isAdmin() && (
            <FormItem {...(data ? drawerLayout : formItemLayout)} label="Hiring Team">
              {getFieldDecorator('createdByTeam', {
                initialValue: createdByTeam,
                rules: [
                  {
                    required: true,
                    message: 'What team should this interview belong to?',
                  },
                ],
              })(
                <Select placeholder="Please select" mode="multiple" style={{ maxWidth: 250 }}>
                  {companyTeams.map(team => (
                    <Option value={team.team}>{team.team}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          )}

          <FormItem {...(data ? drawerLayout : formItemLayout)} label="Name">
            {getFieldDecorator('interviewName', {
              initialValue: interviewName,
              rules: [
                {
                  required: true,
                  message: 'What should this interview be called?',
                  whitespace: true,
                },
              ],
            })(
              <Input
                placeholder="What job is this interview for?"
                style={{ width: '90%', marginRight: 8 }}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayoutHidden} label="Retakes">
            {getFieldDecorator('retakesAllowed', {
              initialValue: interviewConfig.retakesAllowed || 8,
            })(<InputNumber min={0} max={100} />)}
            <span className="ant-form-text"> per interview</span>
          </FormItem>

          <FormItem {...formItemLayoutHidden} label="Prep Time">
            {getFieldDecorator('prepTime', {
              initialValue: interviewConfig.prepTime || 45,
            })(<InputNumber min={15} max={1000} />)}
            <span className="ant-form-text"> seconds per question</span>
          </FormItem>

          <FormItem {...(data ? drawerLayout : formItemLayout)} label="Record Time">
            {getFieldDecorator('answerTime', {
              initialValue: interviewConfig.answerTime || 90,
            })(<InputNumber min={15} max={1000} />)}
            <span className="ant-form-text"> seconds per question</span>
          </FormItem>
          {createFormItems(this.props)}
          <FormItem {...(data ? drawerLayout : formItemLayoutWithOutLabel)}>
            <Button type="dashed" onClick={this.add}>
              <PlusOutlined /> Add Interview Question
            </Button>
          </FormItem>
          <FormItem {...(data ? drawerLayout : formItemLayoutWithOutLabel)}>
            <Button loading={loading} type="primary" htmlType="submit">
              {data ? 'Save & Close' : 'Create Interview'}
            </Button>
          </FormItem>
        </Form>
        {!data && (
          <Fragment>
            <Divider style={{ margin: '24px 0 24px' }} />

            <div className={styles.desc}>
              <h3>Next Steps</h3>
              <h4>Receive Link</h4>
              <p>Once you click Create Interview, you will receive a link.</p>
              <h4>Send to Candidates</h4>
              <p>Put the link you receive in your job posting, or send it to candidates.</p>
              {/* <h4>Need Help Crafting the Emails?</h4>
              <p>
                <a>See example emails</a>
              </p> */}
            </div>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

const CantCreateInterview = () => (
  <Result
    status="error"
    title="Interview Cap Exceeded"
    subTitle="You have used all of your alloted interview slots. To get more interview slots either upgrade, or archive some of your active interviews."
    extra={[
      <UpgradeButton text="Upgrade Plan" />,
      <Button onClick={() => router.push('/interview/view')}>Remove Interviews</Button>,
    ]}
  />
);
// allows use of dispatch
export default connect()(Step1);
