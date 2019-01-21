import React from 'react';

import { Button, Card, Row, Icon, List, Popconfirm } from 'antd';

import styles from './index.less';
import AddYTModal from './AddYTModal';

const youtubeLinks = [
  'https://www.youtube.com/watch?v=aMk5j0xV1Rw',
  'https://www.youtube.com/watch?v=5EGacrmhxn8',
];

class InfoCardEditable extends React.Component {
  state = { modalVisible: false };

  toggleModalVisible = () => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  };

  remove = i => {
    youtubeLinks.splice(i, 1);
    this.forceUpdate();
  };

  addYouTubeLink = link => {
    youtubeLinks.push(link);
  };

  render() {
    const { setVideoData, userName, interviewName, email } = this.props;
    const { modalVisible } = this.state;

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
          dataSource={youtubeLinks}
          renderItem={(item, index) => (
            <div>
              <Icon type="youtube" />{' '}
              <a onClick={() => setVideoData(item, 'YouTube Video')}> {item} </a>
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
