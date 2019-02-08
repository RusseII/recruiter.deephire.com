import React from 'react';

import { Button, Card, Row, Icon, List, Popconfirm } from 'antd';

import styles from './index.less';
import AddYTModal from './AddYTModal';
import { updateCandidateProfile, getCandidateProfile } from '@/services/api';

class InfoCardEditable extends React.Component {
  state = { modalVisible: false, candidateProfileData: {} };

  componentDidMount() {
    const { userId } = this.props;

    getCandidateProfile(userId).then(r => {
      if (r) this.setState({ candidateProfileData: r });
    });
  }

  toggleModalVisible = () => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  };

  remove = i => {
    const { userId } = this.props;
    const { candidateProfileData } = this.state;
    candidateProfileData.youtubeLinks.splice(i, 1);
    this.setState({ candidateProfileData });
    updateCandidateProfile(userId, candidateProfileData);
  };

  addYouTubeLink = link => {
    const { userId } = this.props;

    const { candidateProfileData } = this.state;
    const { youtubeLinks } = candidateProfileData;
    if (!youtubeLinks) {
      candidateProfileData.youtubeLinks = [link];
    } else {
      candidateProfileData.youtubeLinks.push(link);
    }
    this.setState({ candidateProfileData });
    updateCandidateProfile(userId, candidateProfileData);
  };

  render() {
    const { modalVisible, candidateProfileData } = this.state;

    if (!candidateProfileData) return null;
    const { setVideoData, userName, interviewName, email } = this.props;
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
                onConfirm={() => this.remove(index)}
                okText="Delete"
                cancelText="No"
              >
                <Icon className={styles.dynamicDeleteButton} type="minus-circle-o" />
              </Popconfirm>
            </div>
          )}
        />

        <Row>
          <Button type="dashed" onClick={this.toggleModalVisible}>
            <Icon type="plus" /> Add Youtube Link
          </Button>
        </Row>

        <AddYTModal
          visable={modalVisible}
          toggle={this.toggleModalVisible}
          addYouTubeLink={this.addYouTubeLink}
        />
      </Card>
    );
  }
}

export default InfoCardEditable;
