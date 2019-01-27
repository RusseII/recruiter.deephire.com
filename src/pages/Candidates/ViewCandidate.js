import React, { Component } from 'react';
import ReactPlayer from 'react-player';

import { Card, Col, Row, Icon, Table, Button, Form } from 'antd';

import InfoCardEditable from '@/components/InfoCardEditable';
import ShareCandidateButton from '@/components/ShareCandidateButton';

import { getCandidateProfile } from '@/services/api';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './ViewCandidate.less';

const columns = [
  {
    title: 'Questions',
    dataIndex: 'question_text',
    key: 'question_text',
  },
];

const GetURLParameter = sParam => {
  const sPageURL = window.location.search.substring(1);
  const sURLVariables = sPageURL.split('&');
  for (let i = 0; i < sURLVariables.length; i += 1) {
    const sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam) {
      return sParameterName[1];
    }
  }
  return null;
};

const CleanVariable = res => {
  if (res === undefined) return null;
  const no20 = res.replace(/%20/g, ' ');
  const response = no20.replace(/%40/g, '@');
  return response;
};

@connect(({ rule, user }) => ({
  currentUser: user.currentUser,
  rule,
}))
@Form.create()
class App extends Component {
  constructor(props) {
    super(props);

    this.state = { activeQuestion: null };
  }

  componentDidMount() {
    const id = CleanVariable(GetURLParameter('id'));
    const userToken = CleanVariable(GetURLParameter('candidate'));

    const url = 'https://api.deephire.com/v1.0/get_candidate_videos/';

    fetch(`${url + id}/${userToken}`)
      .then(results => results.json())
      .then(
        data => {
          this.setState({
            candidateData: data,
            activeQuestion: 0,
            videoUrl: data[0].response_url,
            currentQuestionText: data[0].question_text,
          });
          return data[0];
        },
        () => {
          this.setState({
            requestFailed: true,
          });
        }
      )
      .then(data => {
        const { user_id: userId } = data;

        getCandidateProfile(userId).then(candidateProfileData => {
          if (candidateProfileData) {
            this.setState({ candidateProfileData });
          } else {
            this.setState({ candidateProfileData: { userId } });
          }
        });
      });
  }

  goToCandidates = () => {
    router.push(`/candidates/candidates`);
  };

  nextQuestion = () => {
    const { activeQuestion, candidateData } = this.state;

    if (activeQuestion + 1 < candidateData.length) {
      const videoUrl = candidateData[activeQuestion + 1].response_url;
      const questionText = candidateData[activeQuestion + 1].question_text;
      this.setVideoData(videoUrl, questionText);

      this.setState({ activeQuestion: activeQuestion + 1 });
    }
  };

  setVideoData = (videoUrl, currentQuestionText) => {
    this.setState({ videoUrl, currentQuestionText });
  };

  previousQuestion = () => {
    const { activeQuestion, candidateData } = this.state;
    if (activeQuestion > 0) {
      const videoUrl = candidateData[activeQuestion - 1].response_url;
      const questionText = candidateData[activeQuestion - 1].question_text;
      this.setVideoData(videoUrl, questionText);
      this.setState({ activeQuestion: activeQuestion - 1 });
    }
  };

  render() {
    const {
      candidateData,
      comments,
      activeQuestion,
      requestFailed,
      videoUrl,
      currentQuestionText,
      candidateProfileData,
    } = this.state;

    if (!candidateData) return <p>Loading...</p>;
    if (comments === null) return <p> Loading! </p>;
    if (activeQuestion === null) return <p> Loading questions... </p>;
    if (requestFailed) return <p>Failed!</p>;
    if (candidateData.length === 0) {
      return <p>There is no data for this user, please message our support</p>;
    }

    const {
      candidate_email: candidateEmail,
      interview_name: interviewName,
      user_name: userName,
    } = candidateData[0];
    // console.log(ReactPlayer.canPlay(response_url));

    return (
      <div>
        <Button style={{ marginBottom: '20px' }} onClick={this.goToCandidates} type="secondary">
          <Icon type="left" />
          Back to Candidates
        </Button>
        <div style={{ float: 'right', marginBottom: '20px' }}>
          <ShareCandidateButton candidateData={candidateData} />
        </div>

        <Row gutter={24}>
          <Col span={8}>
            <InfoCardEditable
              userName={userName}
              interviewName={interviewName}
              email={candidateEmail}
              setVideoData={this.setVideoData}
              candidateProfileData={candidateProfileData}
            />

            <Card hoverable title="Questions">
              <Table
                showHeader={false}
                onRow={(record, index) => ({
                  onClick: () => {
                    const url = candidateData[index].response_url;
                    const text = candidateData[index].question_text;
                    this.setVideoData(url, text);
                    this.setState({ activeQuestion: index });
                  },
                })}
                rowClassName={(record, index) => (index === activeQuestion ? styles.selected : '')}
                pagination={false}
                bordered
                dataSource={candidateData}
                columns={columns}
              />
            </Card>
          </Col>
          <Col span={16}>
            <Card
              title={currentQuestionText}
              actions={[
                <Button shape="circle" icon="left" onClick={this.previousQuestion} />,
                <Button onClick={this.nextQuestion} shape="circle" icon="right" />,
              ]}
            >
              <div className={styles.playerWrapper}>
                <ReactPlayer
                  youTubeConfig={{ playerVars: { rel: false, modestbranding: true } }}
                  preload
                  controls
                  playing
                  className={styles.reactPlayer}
                  height="100%"
                  width="100%"
                  url={videoUrl}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
