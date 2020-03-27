import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Upload, message, Spin } from 'antd';

function beforeUpload(file) {
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 15;
  if (!isLt2M) {
    message.error('Image must smaller than 15!');
  }
  return isJpgOrPng && isLt2M;
}

class Avatar extends React.Component {
  state = {
    loading: false,
  };

  handleChange = info => {
    const { reload } = this.props;
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      reload();
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading } = this.state;
    const { logo } = this.props;

    const uploadButton = (
      <div>
        <LegacyIcon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload Logo</div>
      </div>
    );
    return (
      <Upload
        name="upfile"
        method="put"
        action="https://a.deephire.com/v1/companies/logo"
        headers={{ authorization: `Bearer ${localStorage.getItem('access_token')}` }}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        <Spin spinning={loading}>
          {logo ? <img src={logo} alt="avatar" style={{ height: 50 }} /> : uploadButton}
        </Spin>
      </Upload>
    );
  }
}

export default Avatar;
