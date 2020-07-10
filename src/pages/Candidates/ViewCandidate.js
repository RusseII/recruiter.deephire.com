import React, { useState, useEffect } from 'react';

import { Col, Row, Tooltip, Typography } from 'antd';

import CandidateDataCard from '@/components/Candidate/CandidateDataCard';
// import CandidateNotes from '@/components/Candidate/CandidateNotes';

import ShareCandidateButton from '@/components/ShareCandidateButton';

import { getVideo, getLiveInterview } from '@/services/api';
import { lowerCaseQueryParams } from '@/utils/utils';
import QuestionsCard from '../../components/Candidate/CandidateQuestions';
import CandidateVideo from '../../components/Candidate/CandidateVideo';
import CommentsCard from '../../components/Candidate/CommentsCard';
import { useVideo } from '@/services/hooks';
import AntPageHeader from '@/components/PageHeader/AntPageHeader';

const interval = 1000000;

const ViewCandidate = ({ location }) => {
  const { id, liveid: liveId } = lowerCaseQueryParams(location.search);
  const [candidateData, setCandidateData] = useState(null);
  const [liveInterviewData, setLiveInterviewData] = useState(null);

  const comments = liveInterviewData?.comments || [];
  const marks = {};
  comments.forEach(comment => {
    marks[comment.time * interval] = '';
  });
  const [videoData, setVideoData] = useState({ videoUrl: null, currentQuestionText: null });
  const videoPlayerData = useVideo();
  const getData = async () => {
    getVideo(id).then(data => {
      const [first] = data;
      setCandidateData(first);

      const [response] = first.responses;

      setVideoData({
        videoUrl: response ? response.response : null,
        currentQuestionText: response ? response.question : null,
      });
    });
  };

  const liveInterviews = async () => {
    const liveData = await getLiveInterview(liveId);
    const { recordingUrl } = liveData;
    const lastRecording = recordingUrl.slice(-1)[0];
    setLiveInterviewData(liveData);
    setVideoData({
      videoUrl: lastRecording,
      currentQuestionText: `Live Interview Recording `,
    });
  };

  useEffect(() => {
    if (id) {
      getData();
    }
    if (liveId) {
      liveInterviews();
    }
  }, [videoPlayerData.reload]);

  const { candidateEmail, interviewName, userName, userId, candidateName } = {
    ...liveInterviewData,
    ...candidateData,
  };

  return (
    <div>
      <AntPageHeader
        title={userName || candidateName}
        subTitle={
          <Row>
            <Typography.Text copyable={{ text: candidateEmail }}>
              <Tooltip title="Click to email">
                <a target="_blank" rel="noopener noreferrer" href={`mailto:${candidateEmail}`}>
                  {candidateEmail}
                </a>
              </Tooltip>
            </Typography.Text>
          </Row>
        }
        extra={
          <ShareCandidateButton
            buttonText="Share Candidate"
            setControlKeys={videoPlayerData.setControlKeys}
            candidateData={[{ ...candidateData, liveInterviewData }]}
          />
        }
      />
      {/* <Button
        style={{ marginBottom: '20px' }}
        onClick={
          liveId
            ? () => router.push(`/live-interviews?tab=2`)
            : () => router.push(`/candidates/candidates`)
        }
        type="secondary"
      >
        <LeftOutlined />
        {getWidth() < 400 ? 'Back' : liveId ? 'Back to Live Interviews' : 'Back to Candidates'}
      </Button>
      <div style={{ float: 'right', marginBottom: '20px' }}>
        <ShareCandidateButton candidateData={[{ ...candidateData, liveInterviewData }]} />
      </div> */}

      <Row type="flex" gutter={24}>
        <Col xs={{ span: 24, order: 2 }} sm={24} md={12} lg={12} xl={12} xxl={12}>
          {/* <Space size="large" direction="vertical"> */}
          {/* <CandidateDataCard
            style={{ marginBottom: 24 }}
            userId={userId}
            userName={userName || candidateName}
            interviewName={interviewName}
            email={candidateEmail}
            editable
            setVideoData={setVideoData}
          /> */}

          {id ? (
            <QuestionsCard
              setCandidateData={setCandidateData}
              candidateData={candidateData}
              setVideoData={setVideoData}
              id={id}
              style={{ marginBottom: 24 }}
            />
          ) : (
            <CommentsCard
              liveInterviewData={liveInterviewData}
              {...videoPlayerData}
              style={{ marginBottom: 24 }}
            />
          )}
          <CandidateDataCard
            userId={userId}
            userName="Documents"
            interviewName={interviewName}
            email={candidateEmail}
            editable
            setVideoData={setVideoData}
          />

          {/* </Space> */}
        </Col>
        <Col
          xs={{ span: 24, order: 1 }}
          sm={{ span: 24, order: 1 }}
          md={{ span: 12, order: 2 }}
          lg={{ span: 12, order: 2 }}
          xl={{ span: 12, order: 2 }}
          xxl={{ span: 12, order: 2 }}
        >
          <CandidateVideo marks={marks} {...videoData} {...videoPlayerData} interval={interval} />
        </Col>
      </Row>
    </div>
  );
};

export default ViewCandidate;
