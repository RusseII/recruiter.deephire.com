import React from 'react';

import { Button, Card, Row, Icon, List, Popconfirm } from 'antd';

import styles from './index.less';
import AddYTModal from './AddYTModal';
import { updateCandidateProfile } from '@/services/api';

class InfoCardEditable extends React.Component {
  state = { modalVisible: false };

  componentDidMount() {
    const { candidateProfileData } = this.props;

    this.setState({ candidateProfileData });
  }

  componentWillReceiveProps(props) {
    const { candidateProfileData } = props;
    this.setState({ candidateProfileData });
  }

  toggleModalVisible = () => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  };

  remove = i => {
    const { candidateProfileData } = this.state;
    candidateProfileData.youTubeLinks.splice(i, 1);
    this.setState({ candidateProfileData });
    updateCandidateProfile(candidateProfileData);
  };

  addYouTubeLink = link => {
    const { candidateProfileData } = this.state;
    const { youTubeLinks } = candidateProfileData;
    if (!youTubeLinks) {
      candidateProfileData.youTubeLinks = [];
    }
    candidateProfileData.youTubeLinks.push(link);
    this.setState({ candidateProfileData });
    updateCandidateProfile(candidateProfileData);
  };

  render() {
    const { modalVisible, candidateProfileData } = this.state;

    if (!candidateProfileData) return null;
    const { setVideoData, userName, interviewName, email } = this.props;
    const { youTubeLinks } = candidateProfileData;

    return (
      <Card style={{ marginBottom: '20px' }} hoverable title={userName}>
        <Row>
          <Icon type="insurance" /> {interviewName}
        </Row>
        <Row>
          <Icon type="mail" /> {email}
        </Row>

        <List
          locale={{ emptyText: '' }}
          size="small"
          dataSource={youTubeLinks}
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
            <Icon type="plus" /> Add youTube Link
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
