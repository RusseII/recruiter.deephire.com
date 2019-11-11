import React, { Fragment, useEffect } from 'react';
import { Form, Input, Upload, Spin, Button } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import useCompanyInfo from '@/services/hooks';
import CompanyUpload from '@/components/Upload';

const FormItem = Form.Item;

const getCompanyInfo = async () => {
  return {
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  };
};

const CompanyLogoView = ({ picture }) => (
  <Fragment>
    {/* <div className={styles.avatar_title}>Company Logo</div> */}
    <div className={styles.companyLogo}>
      <img src={picture} alt="solution" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.companyButtonView}>
        <Button icon="upload">Change Logo</Button>
      </div>
    </Upload>
  </Fragment>
);

const BaseView = Form.create()(props => {
  // useEffect(() => getCompanyInfo().then(data => setCompanyData(data)), []);
  const companyData = useCompanyInfo();

  const {
    form: { getFieldDecorator, setFieldsValue, getFieldsValue },
  } = props;

  useEffect(() => {
    Object.keys(getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = companyData[key] || null;
      setFieldsValue(obj);
    });
  }, [companyData]);

  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <Form layout="vertical" onSubmit={getCompanyInfo} hideRequiredMark>
          <FormItem label="Company Name">
            {getFieldDecorator('companyName', {
              rules: [
                {
                  required: true,
                  message: 'Company Name can not be blank',
                },
              ],
            })(<Input disabled />)}
          </FormItem>
        </Form>
      </div>
      <div className={styles.right}>
        <Spin spinning={!companyData}>
          <CompanyLogoView picture={companyData.logo ? companyData.logo : ''} />
        </Spin>
        <CompanyUpload />
      </div>
    </div>
  );
});

// @connect(({ user }) => ({
//   currentUser: user.currentUser,
// }))
export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(BaseView);
