import React, { Component } from 'react';
import ReactPlayer from 'react-player';

import { Card, Col, Row, Icon, Table, Button, Form } from 'antd';

import InfoCardEditable from '@/components/InfoCardEditable';
import ShareCandidateButton from '@/components/ShareCandidateButton';

import { connect } from 'dva';
import router from 'umi/router';
import qs from 'qs';
import styles from './ViewCandidate.less';

const columns = [
  {
    title: 'Questions',
    dataIndex: 'question',
    key: 'question',
  },
];

@connect(({ rule, user }) => ({
  currentUser: user.currentUser,
  rule,
}))
@Form.create()
class ViewCandidate extends Component {
  constructor(props) {
    super(props);

    this.state = { activeQuestion: null };
  }

  componentDidMount() {
    const { location } = this.props;
    const id = qs.parse(location.search)['?id'];

    const url = 'https://a.deephire.com/v1/videos/';

    fetch(`${url + id}`)
      .then(results => results.json())
      .then(
        data => {
          const [first] = data;

          this.setState({
            candidateData: first,
            activeQuestion: 0,
            videoUrl: first.responses[0].response,
            currentQuestionText: first.responses[0].question,
          });
          return data;
        },
        () => {
          this.setState({
            requestFailed: true,
          });
        }
      );
  }

  goToCandidates = () => {
    router.push(`/candidates/candidates`);
  };

  nextQuestion = () => {
    const { activeQuestion, candidateData } = this.state;

    if (activeQuestion + 1 < candidateData.length) {
      const videoUrl = candidateData.responses[activeQuestion + 1].response;
      const questionText = candidateData.responses[activeQuestion + 1].question;
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
      const videoUrl = candidateData.responses[activeQuestion - 1].response;
      const questionText = candidateData.responses[activeQuestion - 1].question;
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
    } = this.state;

    if (!candidateData) return <p>Loading...</p>;
    if (comments === null) return <p> Loading! </p>;
    if (activeQuestion === null) return <p> Loading questions... </p>;
    if (requestFailed) return <p>Failed!</p>;
    if (candidateData.length === 0) {
      return <p>There is no data for this user, please message our support</p>;
    }

    const { candidateEmail, interviewName, userName, userId } = candidateData;

    return (
      <div>
        <Button style={{ marginBottom: '20px' }} onClick={this.goToCandidates} type="secondary">
          <Icon type="left" />
          Back to Candidates
        </Button>
        <div style={{ float: 'right', marginBottom: '20px' }}>
          <ShareCandidateButton candidateData={candidateData} />
        </div>

        <Row type="flex" gutter={24}>
          <Col xs={{ span: 24, order: 2 }} sm={24} md={8} lg={8} xl={8}>
            <InfoCardEditable
              userId={userId}
              userName={userName}
              interviewName={interviewName}
              email={candidateEmail}
              setVideoData={this.setVideoData}
            />

            <Card hoverable title="Questions">
              <Table
                showHeader={false}
                onRow={(record, index) => ({
                  onClick: () => {
                    const url = candidateData.responses[index].response;
                    const text = candidateData.responses[index].question;
                    this.setVideoData(url, text);
                    this.setState({ activeQuestion: index });
                  },
                })}
                rowClassName={(record, index) => (index === activeQuestion ? styles.selected : '')}
                pagination={false}
                bordered
                dataSource={candidateData.responses}
                columns={columns}
              />
            </Card>
          </Col>
          <Col
            xs={{ span: 24, order: 1 }}
            sm={{ span: 24, order: 1 }}
            md={{ span: 16, order: 2 }}
            lg={{ span: 16, order: 2 }}
            xl={{ span: 16, order: 2 }}
          >
            <Card
              style={{ marginBottom: 20 }}
              title={currentQuestionText}
              actions={[
                <Button shape="circle" icon="left" onClick={this.previousQuestion} />,
                <Button onClick={this.nextQuestion} shape="circle" icon="right" />,
              ]}
            >
              <div className={styles.playerWrapper}>
                <ReactPlayer
                  youtubeConfig={{ playerVars: { rel: false, modestbranding: true } }}
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

export default ViewCandidate;
