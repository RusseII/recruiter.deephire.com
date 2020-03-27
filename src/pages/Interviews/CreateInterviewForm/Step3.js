import React, { Fragment } from 'react';
import { connect } from 'dva';
import { CopyOutlined } from '@ant-design/icons';
import { Tooltip, message, Button, Row, Col } from 'antd';
import router from 'umi/router';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Result from '@/components/Result';
import styles from './style.less';
import { getHttpUrl } from '@/utils/utils';

@connect(({ form, user }) => ({
  currentUser: user.currentUser,
  shortLink: form,
}))
class Step3 extends React.PureComponent {
  render() {
    const { shortLink } = this.props;
    const { link } = shortLink;
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
            <Tooltip title="Click to copy">
              <CopyToClipboard
                text={getHttpUrl(link)}
                onCopy={() => message.success('Link Copied')}
              >
                <a>{`${link}  `}</a>
              </CopyToClipboard>
              <CopyToClipboard
                text={getHttpUrl(link)}
                onCopy={() => message.success('Link Copied')}
              >
                <Button size="small" icon={<CopyOutlined />} />
              </CopyToClipboard>
            </Tooltip>
          </Col>
        </Row>
        {/* <Row>
          <Col xs={24} sm={8} className={styles.label}>
            Email：
          </Col>
          <Col xs={24} sm={16}>
            {currentUser.email}
          </Col>
        </Row> */}
      </div>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          Create another
        </Button>
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
