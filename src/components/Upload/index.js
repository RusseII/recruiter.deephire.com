import React from 'react';
import { Upload, Icon, message } from 'antd';

// const props = {
//     name: 'upfile',
//     action: `https://a.deephire.com/v1/candidates/${email}/documents/`,
//     headers: { authorization: `Bearer ${localStorage.getItem('access_token')}` },
//     onChange({ file }) {
//       if (file.status === 'done') {
//         setKey(file.status);
//       }
//     },
//     // defaultFileList: candidateProfileData.files,
//     // key: candidateProfileData.files,
//     // onRemove(file) {
//     //   removeCandidateDocument(email, file.uid);
//     // },
//   };

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
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
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        })
      );
    }
  };

  render() {
    const { loading } = this.state;
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
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
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    );
  }
}

export default Avatar;
