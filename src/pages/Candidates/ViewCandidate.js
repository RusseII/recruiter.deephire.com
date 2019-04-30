import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

import { Card, Col, Row, Icon, Table, Button } from 'antd';

import InfoCardEditable from '@/components/InfoCardEditable';
import ShareCandidateButton from '@/components/ShareCandidateButton';

import router from 'umi/router';
import qs from 'qs';
import styles from './ViewCandidate.less';
import { getVideo } from '@/services/api';

const columns = [
  {
    title: 'Questions',
    dataIndex: 'question',
    key: 'question',
  },
];

const ViewCandidate = ({ location }) => {
  const id = qs.parse(location.search)['?id'];

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [candidateData, setCandidateData] = useState(null);
  const [videoData, setVideoData] = useState({ videoUrl: null, currentQuestionText: null });

  useEffect(() => {
    getVideo(id).then(data => {
      const [first] = data;
      const [response] = first.responses;
      setCandidateData(first);
      setVideoData({ videoUrl: response.response, currentQuestionText: response.question });
    });
  }, []);

  const goToCandidates = () => {
    router.push(`/candidates/candidates`);
  };

  const nextQuestion = () => {
    if (activeQuestion + 1 < candidateData.responses.length) {
      const videoUrl = candidateData.responses[activeQuestion + 1].response;
      const currentQuestionText = candidateData.responses[activeQuestion + 1].question;
      setVideoData({ videoUrl, currentQuestionText });

      setActiveQuestion(activeQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (activeQuestion > 0) {
      const videoUrl = candidateData.responses[activeQuestion - 1].response;
      const currentQuestionText = candidateData.responses[activeQuestion - 1].question;
      setVideoData({ videoUrl, currentQuestionText });
      setActiveQuestion(activeQuestion - 1);
    }
  };

  if (!candidateData) return <p>Loading...</p>;
  if (activeQuestion === null) return <p> Loading questions... </p>;
  if (candidateData.length === 0) {
    return <p>There is no data for this user, please message our support</p>;
  }

  const { candidateEmail, interviewName, userName, userId } = candidateData;

  return (
    <div>
      <Button style={{ marginBottom: '20px' }} onClick={goToCandidates} type="secondary">
        <Icon type="left" />
        Back to Candidates
      </Button>
      <div style={{ float: 'right', marginBottom: '20px' }}>
        <ShareCandidateButton candidateData={[candidateData]} />
      </div>

      <Row type="flex" gutter={24}>
        <Col xs={{ span: 24, order: 2 }} sm={24} md={8} lg={8} xl={8}>
          <InfoCardEditable
            userId={userId}
            userName={userName}
            interviewName={interviewName}
            email={candidateEmail}
            setVideoData={setVideoData}
          />

          <Card hoverable title="Questions">
            <Table
              showHeader={false}
              onRow={(record, index) => ({
                onClick: () => {
                  const videoUrl = candidateData.responses[index].response;
                  const currentQuestionText = candidateData.responses[index].question;
                  setVideoData({ videoUrl, currentQuestionText });
                  setActiveQuestion(index);
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
            title={videoData.currentQuestionText}
            actions={[
              <Button shape="circle" icon="left" onClick={() => previousQuestion()} />,
              <Button onClick={nextQuestion} shape="circle" icon="right" />,
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
                url={videoData.videoUrl}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViewCandidate;
