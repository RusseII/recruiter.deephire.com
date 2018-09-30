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
      router.push('/form/create-interview/info');
    };
    const information = (
      <div className={styles.information}>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            Link:
          </Col>
          <Col xs={24} sm={16}>
            {data.interviewLink}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            Name：
          </Col>
          <Col xs={24} sm={16}>
            {data.interviewName}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            email：
          </Col>
          <Col xs={24} sm={16}>
            {currentUser.email}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            Link:
          </Col>
          <Col xs={24} sm={16}>
            <span className={styles.money}>{data.amount}</span> 元
          </Col>
        </Row>
      </div>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          Create another
        </Button>
        <Button>Do Nothing</Button>
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
