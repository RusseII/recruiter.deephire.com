import React, { useState, useEffect } from 'react';

import { Upload, Button, Card, Row, Icon, List, Popconfirm } from 'antd';

import styles from './index.less';
import AddYTModal from './AddYTModal';
import { updateCandidateProfile, getCandidateProfile } from '@/services/api';

const props = {
  action: '//jsonplaceholder.typicode.com/posts/',
  onChange({ file, fileList }) {
    if (file.status !== 'uploading') {
      console.log(file, fileList);
    }
  },
  defaultFileList: [],
};
const InfoCardEditable = ({ userId, setVideoData, userName, interviewName, email }) => {
  const [modalVisible, setmodalVisible] = useState(false);
  const [candidateProfileData, setCandidateProfileData] = useState({});

  useEffect(() => {
    getCandidateProfile(userId).then(r => {
      if (r) setCandidateProfileData(r);
    });
  }, []);

  const toggleModalVisible = () => {
    setmodalVisible(!modalVisible);
  };

  const remove = i => {
    candidateProfileData.youtubeLinks.splice(i, 1);
    // setCandidateProfileData(candidateProfileData);
    updateCandidateProfile(userId, candidateProfileData).then(r => setCandidateProfileData(r));
  };

  const addYouTubeLink = link => {
    const { youtubeLinks } = candidateProfileData;
    if (!youtubeLinks) {
      candidateProfileData.youtubeLinks = [link];
    } else {
      candidateProfileData.youtubeLinks.push(link);
    }
    updateCandidateProfile(userId, candidateProfileData).then(r => setCandidateProfileData(r));
  };

  if (!candidateProfileData) return null;
  const { youtubeLinks } = candidateProfileData;

  return (
    <Card style={{ marginBottom: '20px' }} hoverable title={userName}>
      <Row>
        <Icon type="insurance" /> {interviewName}
      </Row>
      <Row>
        <Icon type="mail" /> {email}
      </Row>

      <List
        locale={{ emptyText: ' ' }}
        // locale=""

        size="small"
        dataSource={youtubeLinks}
        renderItem={(item, index) => (
          <div>
            <Icon type="youtube" />{' '}
            <a onClick={() => setVideoData(item, 'YouTube Video')}>
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
              <Icon className={styles.dynamicDeleteButton} type="minus-circle-o" />
            </Popconfirm>
          </div>
        )}
      />

      <Row>
        <Button style={{ marginRight: '20px' }} type="dashed" onClick={toggleModalVisible}>
          <Icon type="plus" /> Add Youtube Link
        </Button>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Add Document
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
