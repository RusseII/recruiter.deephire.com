import React, { useState, useEffect } from 'react';

import {
  InsuranceOutlined,
  MailOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';

import { Upload, Button, Card, Row, List, Popconfirm, Tooltip } from 'antd';

import styles from './index.less';
import AddYTModal from './AddYTModal';
import {
  updateCandidateProfile,
  getCandidateProfile,
  removeCandidateDocument,
} from '@/services/api';

const InfoCardEditable = ({ setVideoData, userName, interviewName, email }) => {
  const [modalVisible, setmodalVisible] = useState(false);
  const [candidateProfileData, setCandidateProfileData] = useState({});
  const [key, setKey] = useState(1);

  useEffect(() => {
    getCandidateProfile(email).then(r => {
      const candidateProfile = r;
      if (r) {
        if (candidateProfile.files) {
          candidateProfile.files = r.files.map(r => ({
            ...r,
            url: `https://a.deephire.com/v1/candidates/${email}/documents/${r.uid}`,
          }));
        }
        setCandidateProfileData(candidateProfile);
      }
    });
  }, [key]);

  const props = {
    name: 'upfile',
    action: `https://a.deephire.com/v1/candidates/${email}/documents/`,
    headers: { authorization: `Bearer ${localStorage.getItem('access_token')}` },
    onChange({ file }) {
      if (file.status === 'done') {
        setKey(file.status);
      }
    },
    defaultFileList: candidateProfileData.files,
    key: candidateProfileData.files,
    onRemove(file) {
      removeCandidateDocument(email, file.uid);
    },
  };

  const toggleModalVisible = () => {
    setmodalVisible(!modalVisible);
  };

  const remove = i => {
    candidateProfileData.youtubeLinks.splice(i, 1);
    // setCandidateProfileData(candidateProfileData);
    updateCandidateProfile(email, candidateProfileData).then(r => setCandidateProfileData(r));
  };

  const addYouTubeLink = link => {
    const { youtubeLinks } = candidateProfileData;
    if (!youtubeLinks) {
      candidateProfileData.youtubeLinks = [link];
    } else {
      candidateProfileData.youtubeLinks.push(link);
    }
    updateCandidateProfile(email, candidateProfileData).then(r => setCandidateProfileData(r));
  };

  if (!candidateProfileData) return null;
  const { youtubeLinks } = candidateProfileData;

  return (
    <Card style={{ marginBottom: '20px' }} hoverable title={userName}>
      <Row>
        <InsuranceOutlined style={{ padding: 4 }} /> {interviewName}
      </Row>
      <Row>
        <MailOutlined style={{ padding: 4 }} />
        <Tooltip title="Click to email">
          <a target="_blank" rel="noopener noreferrer" href={`mailto:${email}`}>
            {` ${email}`}
          </a>
        </Tooltip>
      </Row>

      <List
        locale={{ emptyText: ' ' }}
        // locale=""

        size="small"
        dataSource={youtubeLinks}
        renderItem={(item, index) => (
          <div>
            <YoutubeOutlined />{' '}
            <a
              onClick={() => setVideoData({ videoUrl: item, currentQuestionText: 'YouTube Video' })}
            >
              {' '}
              {item.replace('www.youtube.com/watch?v=', 'youtu.be/')}{' '}
            </a>
            <Popconfirm
              placement="rightTop"
              title="Are you sure you want to delete this?"
              onConfirm={() => remove(index)}
              okText="Delete"
              cancelText="No"
            >
              <MinusCircleOutlined className={styles.dynamicDeleteButton} />
            </Popconfirm>
          </div>
        )}
      />

      <Row>
        <Button style={{ marginRight: '20px' }} type="dashed" onClick={toggleModalVisible}>
          <PlusOutlined /> Add YT Video
        </Button>
        <Upload key={key} {...props}>
          <Button>
            <UploadOutlined /> Add Document
          </Button>
        </Upload>
      </Row>

      <AddYTModal
        visable={modalVisible}
        toggle={toggleModalVisible}
        addYouTubeLink={addYouTubeLink}
      />
    </Card>
  );
};

export default InfoCardEditable;
