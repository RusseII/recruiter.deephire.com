import React, { useState, useEffect } from 'react';

import { Col, Row, Tooltip, Typography, Collapse, Card, Rate, Result } from 'antd';

import { lowerCaseQueryParams } from '@bit/russeii.deephire.utils.utils';
import CandidateVideo from '@bit/russeii.deephire.candidate.video';
import ReactQuill from 'react-quill';
import CandidateDataCard from '@/components/Candidate/DataCard';
import ShareCandidateButton from '@/components/ShareCandidateButton';
import 'react-quill/dist/quill.snow.css';

import {
  addComment,
  removeComment,
  getVideo,
  getCandidateProfile,
  removeCandidateDocument,
} from '@/services/api';

import { useLive } from '@/services/apiHooks';

import QuestionsCard from '../../components/Candidate/Questions';
import CommentsCard from '../../components/Candidate/CommentsCard';
import { useVideo } from '@/services/hooks';
import AntPageHeader from '@/components/PageHeader/AntPageHeader';
import ArchiveButton from '@/components/ArchiveButton';

const { Panel } = Collapse;

const interval = 1000000;

const ViewCandidate = ({ location }) => {
  const { id, liveid: liveId } = lowerCaseQueryParams(location.search);
  const [candidateData, setCandidateData] = useState(null);
  const [archives, setArchives] = useState(false);
  const { mutate, data: liveData } = useLive(liveId);

  const recordingAvaliable =
    id ||
    (liveData?.recordingStatus === 'composition-available' && liveData?.recordingUrl?.length !== 0);

  // const renderNotes = useMemo(() => notesCard(liveData), [liveData]);

  const videoPlayerData = useVideo();

  useEffect(() => {
    if (liveData) {
      const lastRecording = liveData?.recordingUrl?.slice(-1)[0];
      videoPlayerData.setVideoUrl(lastRecording);
    }
  }, [liveData]);

  const comments = liveData?.comments || [];
  const marks = {};
  comments.forEach(comment => {
    marks[comment.time * interval] = '';
  });

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

  useEffect(() => {
    if (id) {
      getArchiveData();
    }
  }, [videoPlayerData.reload, archives]);

  const { candidateEmail, interviewName, userName, userId, candidateName } = {
    ...liveData,
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
            candidateData={[{ ...candidateData, liveInterviewData: liveData }]}
          />
        }
      />

      <Row type="flex" gutter={24}>
        <Col xs={{ span: 24, order: 2 }} sm={24} md={12} lg={12} xl={12} xxl={12}>
          {id ? (
            <QuestionsCard
              candidateData={candidateData}
              {...videoPlayerData}
              editable={{ archives, setArchives }}
              style={{ marginBottom: 24 }}
              ArchiveButton={ArchiveButton}
            />
          ) : (
            <>
              {recordingAvaliable && (
                <CommentsCard
                  liveInterviewData={liveData}
                  mutate={mutate}
                  {...videoPlayerData}
                  editable={{ addComment, removeComment }}
                  style={{ marginBottom: 24 }}
                />
              )}
            </>
          )}
          <CandidateDataCard
            userId={userId}
            userName="Documents"
            interviewName={interviewName}
            email={candidateEmail}
            editable
            getCandidateProfile={getCandidateProfile}
            removeCandidateDocument={removeCandidateDocument}
            style={{ marginBottom: 24 }}
          />
          {liveId && <NotesCard data={liveData} />}
        </Col>
        <Col
          xs={{ span: 24, order: 1 }}
          sm={{ span: 24, order: 1 }}
          md={{ span: 12, order: 2 }}
          lg={{ span: 12, order: 2 }}
          xl={{ span: 12, order: 2 }}
          xxl={{ span: 12, order: 2 }}
        >
          {recordingAvaliable ? (
            <CandidateVideo marks={marks} {...videoPlayerData} interval={interval} />
          ) : (
            <Card>
              <Result
                title="Video not avaliable"
                extra={
                  liveData?.recordingStatus === 'composition-available'
                    ? 'Recording was deleted'
                    : liveData?.recordingStatus
                }
              />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

const NotesCard = React.memo(({ data }) => {
  const participants = Object.keys(data?.participants || {});
  return (
    <Card title="Live Interview Notes & Feedback">
      <Collapse accordion>
        {participants?.map(name => (
          <Panel header={name} key={name}>
            <div style={{ marginBottom: 8 }}>
              Interview Rating: <Rate value={data?.participants?.[name]?.feedback} disabled />
            </div>
            <ReactQuill
              readOnly
              modules={{ toolbar: false }}
              value={data?.participants?.[name]?.notes}
            />
          </Panel>
        ))}
      </Collapse>
    </Card>
  );
});
export default ViewCandidate;
