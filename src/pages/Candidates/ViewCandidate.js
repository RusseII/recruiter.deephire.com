import React, { useState, useEffect } from 'react';

import { Col, Row, PageHeader, Tooltip } from 'antd';
import router from 'umi/router';

import CandidateDataCard from '@/components/Candidate/CandidateDataCard';
// import CandidateNotes from '@/components/Candidate/CandidateNotes';

import ShareCandidateButton from '@/components/ShareCandidateButton';

import { getVideo, getLiveInterview } from '@/services/api';
import { lowerCaseQueryParams } from '@/utils/utils';
import QuestionsCard from '../../components/Candidate/CandidateQuestions';
import CandidateVideo from '../../components/Candidate/CandidateVideo';

const ViewCandidate = ({ location }) => {
  const { id, liveid: liveId } = lowerCaseQueryParams(location.search);
  const [candidateData, setCandidateData] = useState(null);
  const [liveInterviewData, setLiveInterviewData] = useState(null);

  const [videoData, setVideoData] = useState({ videoUrl: null, currentQuestionText: null });

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
      currentQuestionText: 'Live Interview Recording',
    });
  };

  useEffect(() => {
    if (id) {
      getData();
    }
    if (liveId) {
      liveInterviews();
    }
  }, []);

  const { candidateEmail, interviewName, userName, userId, candidateName } = {
    ...liveInterviewData,
    ...candidateData,
  };

  return (
    <div>
      <PageHeader
        style={{ width: 'calc(100% + 48px)', marginTop: -22, marginBottom: 24, marginLeft: -24 }}
        onBack={() => router.goBack()}
        title={userName || candidateName}
        ghost={false}
        subTitle={
          <Row>
            <Tooltip title="Click to email">
              <a target="_blank" rel="noopener noreferrer" href={`mailto:${candidateEmail}`}>
                {candidateEmail}
              </a>
            </Tooltip>
          </Row>
        }
        extra={
          <ShareCandidateButton
            buttonText="Share Candidate"
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
        <Col xs={{ span: 24, order: 2 }} sm={24} md={10} lg={12} xl={10} xxl={10}>
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

          {id && (
            <QuestionsCard
              setCandidateData={setCandidateData}
              candidateData={candidateData}
              setVideoData={setVideoData}
              id={id}
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
          md={{ span: 14, order: 2 }}
          lg={{ span: 12, order: 2 }}
          xl={{ span: 14, order: 2 }}
          xxl={{ span: 14, order: 2 }}
        >
          <CandidateVideo {...videoData} />
        </Col>
      </Row>
    </div>
  );
};

export default ViewCandidate;
