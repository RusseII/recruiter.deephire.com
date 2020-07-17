import React, { useState, useEffect } from 'react';

import { Col, Row, Tooltip, Typography } from 'antd';

import { lowerCaseQueryParams } from '@bit/russeii.deephire.utils.utils';
import CandidateDataCard from '@/components/Candidate/DataCard';
// import CandidateNotes from '@/components/Candidate/CandidateNotes';

import ShareCandidateButton from '@/components/ShareCandidateButton';

import {
  addComment,
  removeComment,
  getVideo,
  getLiveInterview,
  getCandidateProfile,
  removeCandidateDocument,
} from '@/services/api';

import QuestionsCard from '../../components/Candidate/Questions';
import CandidateVideo from '../../components/Candidate/Video';
import CommentsCard from '../../components/Candidate/CommentsCard';
import { useVideo } from '@/services/hooks';
import AntPageHeader from '@/components/PageHeader/AntPageHeader';
import ArchiveButton from '@/components/ArchiveButton';

const interval = 1000000;

const ViewCandidate = ({ location }) => {
  const { id, liveid: liveId } = lowerCaseQueryParams(location.search);
  const [candidateData, setCandidateData] = useState(null);
  const [liveInterviewData, setLiveInterviewData] = useState(null);
  const [archives, setArchives] = useState(false);

  const comments = liveInterviewData?.comments || [];
  const marks = {};
  comments.forEach(comment => {
    marks[comment.time * interval] = '';
  });
  const videoPlayerData = useVideo();

  const getArchiveData = async () => {
    await getVideo(id).then(data => {
      const [first] = data;
      setCandidateData(first);
      //   return first;
      const [response] = first.responses;

      if (!archives) videoPlayerData.setVideoUrl(response ? response.response : null);
      else if (first.archivedResponses) {
        const [archivedResponse] = first.archivedResponses;
        videoPlayerData.setVideoUrl(archivedResponse ? archivedResponse.response : null);
      }
    });
  };

  const liveInterviews = async () => {
    const liveData = await getLiveInterview(liveId);
    const { recordingUrl } = liveData;
    const lastRecording = recordingUrl.slice(-1)[0];
    setLiveInterviewData(liveData);
    videoPlayerData.setVideoUrl(lastRecording);
  };

  useEffect(() => {
    if (id) {
      getArchiveData();
    }
    if (liveId) {
      liveInterviews();
    }
  }, [videoPlayerData.reload, archives]);

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
            videoPlayerData.setVideoUrl={videoPlayerData.setVideoUrl}
          /> */}

          {id ? (
            <QuestionsCard
              candidateData={candidateData}
              {...videoPlayerData}
              editable={{ archives, setArchives }}
              style={{ marginBottom: 24 }}
              ArchiveButton={ArchiveButton}
            />
          ) : (
            <CommentsCard
              liveInterviewData={liveInterviewData}
              {...videoPlayerData}
              editable={{ addComment, removeComment }}
              style={{ marginBottom: 24 }}
            />
          )}
          <CandidateDataCard
            userId={userId}
            userName="Documents"
            interviewName={interviewName}
            email={candidateEmail}
            editable
            getCandidateProfile={getCandidateProfile}
            removeCandidateDocument={removeCandidateDocument}
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
          <CandidateVideo marks={marks} {...videoPlayerData} interval={interval} />
        </Col>
      </Row>
    </div>
  );
};

export default ViewCandidate;
