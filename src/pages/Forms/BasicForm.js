// import React, { PureComponent } from 'react';
// import { connect } from 'dva';
// import {
//   Form,
//   Input,
//   DatePicker,
//   Select,
//   Button,
//   Card,
//   InputNumber,
//   Radio,
//   Icon,
//   Tooltip,
// } from 'antd';
// import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import styles from './style.less';

// const FormItem = Form.Item;
// const { Option } = Select;
// const { RangePicker } = DatePicker;
// const { TextArea } = Input;

// let uuid = 1;

// @connect(({ loading }) => ({
//   submitting: loading.effects['form/submitRegularForm'],
// }))
// @Form.create()
// class BasicForms extends PureComponent {
//   componentDidMount() {
//     localStorage.setItem('location', this.props.location['pathname']);
//     // Router.push("/showInterviewLink");
//   }
//   login() {
//     this.props.auth.login();
//   }

//   remove = k => {
//     const { form } = this.props;
//     // can use data-binding to get
//     const keys = form.getFieldValue('keys');
//     // We need at least one passenger
//     if (keys.length === 1) {
//       return;
//     }

//     // can use data-binding to set
//     form.setFieldsValue({
//       keys: keys.filter(key => key !== k),
//     });
//   };

//   add = () => {
//     const { form } = this.props;
//     // can use data-binding to get
//     const keys = form.getFieldValue('keys');
//     var nextKeys = keys.concat(uuid);
//     uuid++;
//     // var nextKeys = nextKeys.concat(uuid);
//     //     uuid++;
//     console.log(nextKeys);
//     // can use data-binding to set
//     // important! notify form to detect changes
//     form.setFieldsValue({
//       keys: nextKeys,
//     });
//   };

//   handleSubmit = e => {
//     e.preventDefault();
//     this.props.form.validateFields((err, values) => {
//       if (!err) {
//         var { prepTime, retakesAllowed, answerTime, interviewName, interviewQuestions } = values;
//         interviewQuestions = interviewQuestions.map(a => ({
//           question: a,
//         }));
//         console.log('Received values of form: ', values);

//         const dateTime = Date.now();
//         const timestamp = Math.floor(dateTime / 1000);
//         const { email } = JSON.parse(localStorage.getItem('user_profile'));
//         console.log('email is', email);

//         var data = {
//           interviewName,
//           email,
//           interview_questions: interviewQuestions,
//           interview_config: { retakesAllowed, prepTime, answerTime },
//           timestamp,
//         };

//         fetch(ApiHostedURL + '/v1.0/create_interview', {
//           method: 'POST',
//           headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(data),
//         })
//           .then(response => response.json())
//           .then(data => history.push('/showInterviewLink/' + encodeURIComponent(data)))

//           .catch(err => console.log('err', err));
//       }
//     });
//   };
//   handleSubmit = e => {
//     const { dispatch, form } = this.props;
//     e.preventDefault();
//     form.validateFieldsAndScroll((err, values) => {
//       if (!err) {
//         dispatch({
//           type: 'form/submitRegularForm',
//           payload: values,
//         });
//       }
//     });
//   };

//   render() {
//     const { submitting } = this.props;
//     const {
//       form: { getFieldDecorator, getFieldValue },
//     } = this.props;

//     const formItemLayout = {
//       labelCol: {
//         xs: { span: 24 },
//         sm: { span: 7 },
//       },
//       wrapperCol: {
//         xs: { span: 24 },
//         sm: { span: 12 },
//         md: { span: 10 },
//       },
//     };

//     const submitFormLayout = {
//       wrapperCol: {
//         xs: { span: 24, offset: 0 },
//         sm: { span: 10, offset: 7 },
//       },
//     };

//     //#TODO PUT THIS BACK IN TO REQUIRE AUTH
//     // const { isAuthenticated } = this.props.auth;

//     // if (!isAuthenticated()) {
//     //   this.login();
//     // }

//     const formItemLayoutWithOutLabel = {
//       wrapperCol: {
//         xs: { span: 24 },
//         sm: { span: 12 },
//         md: { span: 10 },
//       },
//     };
//     getFieldDecorator('keys', { initialValue: [0] });
//     const keys = getFieldValue('keys');
//     const formItems = keys.map((k, index) => {
//       return (
//         <FormItem
//           {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
//           label={index === 0 ? 'Interview questions' : ''}
//           required={false}
//           key={k}
//         >
//           {getFieldDecorator(`interviewQuestions[${k}]`, {
//             validateTrigger: ['onChange', 'onBlur'],
//             rules: [
//               {
//                 required: true,
//                 whitespace: true,
//                 message: 'Please input interview question or delete this field.',
//               },
//             ],
//           })(
//             <Input
//               placeholder={'Interview Question ' + (index + 1)}
//               style={{ width: '60%', marginRight: 8 }}
//             />
//           )}
//           {keys.length > 1 ? (
//             <Icon
//               className="dynamic-delete-button"
//               type="minus-circle-o"
//               disabled={keys.length === 1}
//               onClick={() => this.remove(k)}
//             />
//           ) : null}
//           {/* <Input placeholder="Interview Question" style={{ width: "60%", marginRight: 8 }} /> */}
//         </FormItem>
//       );
//     });

//     return (
//       <PageHeaderWrapper title="Create Interview" content="Create a new interview here!">
//         <Card bordered={false}>
//           <Form onSubmit={this.handleSubmit}>
//             <FormItem {...formItemLayout} label="Interview Name">
//               {getFieldDecorator('interviewName', {
//                 rules: [
//                   {
//                     required: true,
//                     message: 'What should this interview be called?',
//                     whitespace: true,
//                   },
//                 ],
//               })(<Input style={{ width: '60%' }} />)}
//             </FormItem>
//             <FormItem {...formItemLayout} label="Retakes">
//               {getFieldDecorator('retakesAllowed', {
//                 initialValue: 8,
//               })(<InputNumber min={0} max={100} />)}
//               <span className="ant-form-text"> per interview</span>
//             </FormItem>

//             <FormItem {...formItemLayout} label="Prep Time">
//               {getFieldDecorator('prepTime', {
//                 initialValue: 45,
//               })(<InputNumber min={15} max={1000} />)}
//               <span className="ant-form-text"> seconds per question</span>
//             </FormItem>

//             <FormItem {...formItemLayout} label="Record Time">
//               {getFieldDecorator('answerTime', {
//                 initialValue: 90,
//               })(<InputNumber min={15} max={1000} />)}
//               <span className="ant-form-text"> seconds per question</span>
//             </FormItem>
//             {formItems}
//             <FormItem {...formItemLayoutWithOutLabel}>
//               <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
//                 <Icon type="plus" /> Add Interview Question
//               </Button>
//             </FormItem>
//             <FormItem {...formItemLayoutWithOutLabel}>
//               <Button type="primary" htmlType="submit">
//                 Create Interview
//               </Button>
//             </FormItem>
//           </Form>
//         </Card>
//       </PageHeaderWrapper>
//     );
//   }
// }

// export default BasicForms;
