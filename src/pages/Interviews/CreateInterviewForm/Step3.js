import React from 'react';
import { connect } from 'dva';
import { CopyOutlined } from '@ant-design/icons';
import { Tooltip, message, Button, Row, Col, Space } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { getHttpUrl } from '@bit/russeii.deephire.utils.utils';
import Link from 'umi/link';
import Result from '@/components/Result';
import styles from './style.less';

@connect(({ form, user }) => ({
  currentUser: user.currentUser,
  shortLink: form,
}))
class Step3 extends React.PureComponent {
  render() {
    const { shortLink } = this.props;
    const { link } = shortLink;

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
      <Space>
        <Link to="/one-way/jobs/create/info">
          <Button>Create another</Button>
        </Link>

        <Link to="/one-way/jobs">
          <Button type="primary">View Jobs</Button>
        </Link>
      </Space>
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
