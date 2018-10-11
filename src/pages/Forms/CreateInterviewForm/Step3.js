import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import styles from './style.less';

@connect(({ form, user }) => ({
  currentUser: user.currentUser,

  data: form.step,
}))
class Step3 extends React.PureComponent {
  render() {
    console.log(this.props);
    const { data, currentUser } = this.props;
    const onFinish = () => {
      router.push('/interview/create-interview/info');
    };
    const information = (
      <div className={styles.information}>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
           Interview Link：
          </Col>
          <Col xs={24} sm={16}>
            {data.interviewLink}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
          Email：
          </Col>
          <Col xs={24} sm={16}>
            {currentUser.email}
          </Col>
        </Row>
        
       
      </div>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          Create another
        </Button>
        {/* <Button>Do Nothing</Button> */}
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="Interview Created!"
        description="Send this link to candidates"
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default Step3;
