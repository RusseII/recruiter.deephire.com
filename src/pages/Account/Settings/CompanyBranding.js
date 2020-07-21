import React, { useEffect, useState } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Spin } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import { useCompanyInfo } from '@/services/complexHooks';
import CompanyUpload from '@/components/Upload';

const FormItem = Form.Item;

const BaseView = Form.create()(props => {
  const [flag, setFlag] = useState(false);
  const companyData = useCompanyInfo(flag);

  const {
    form: { getFieldDecorator, setFieldsValue, getFieldsValue },
  } = props;

  useEffect(() => {
    Object.keys(getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = companyData ? companyData[key] : null;
      setFieldsValue(obj);
    });
  }, [companyData]);

  return (
    <div className={styles.baseView}>
      <br />
      <div className={styles.left}>
        <Form layout="vertical" onSubmit={() => {}} hideRequiredMark>
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
        {/* <StandardTable
          selectedRows={[]}
          data={{ list: testData }}
          // size="small"
          columns={columns}
        /> */}
      </div>
      <div className={styles.right}>
        <Spin spinning={!companyData}>
          {companyData && <CompanyUpload logo={companyData.logo} reload={() => setFlag(!flag)} />}
        </Spin>
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
