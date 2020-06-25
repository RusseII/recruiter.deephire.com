import React, { PureComponent, Fragment } from 'react';
import { Card, Steps } from 'antd';
import styles from '../style.less';
import AntPageHeader from '@/components/PageHeader/AntPageHeader';

const { Step } = Steps;

export default class CreateInterviewForm extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'info':
        return 0;
      case 'result':
        return 1;
      default:
        return 0;
    }
  }

  render() {
    const { children } = this.props;
    return (
      <>
        <AntPageHeader
          title="Create Interview Template"
          subTitle="Interview Templates can later be used to invite candidates to a one way interview"
        />

        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="Create the Interview" />
              <Step title="Complete" />
            </Steps>
            {children}
          </Fragment>
        </Card>
      </>
    );
  }
}
