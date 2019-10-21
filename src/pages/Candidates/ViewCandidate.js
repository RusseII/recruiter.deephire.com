import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

import { Card, Col, Row, Icon, Table, Button } from 'antd';
import router from 'umi/router';
import qs from 'qs';

import InfoCardEditable from '@/components/InfoCardEditable';
import ShareCandidateButton from '@/components/ShareCandidateButton';

import styles from './ViewCandidate.less';
import { getVideo } from '@/services/api';
import ArchiveButton from '@/components/ArchiveButton';

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
  const [archives, setArchives] = useState(false);

  const getData = async () => {
    getVideo(id).then(data => {
      const [first] = data;
      setCandidateData(first);

      const [response] = first.responses;

      if (!archives)
        setVideoData({
          videoUrl: response ? response.response : null,
          currentQuestionText: response ? response.question : null,
        });
      else if (first.archivedResponses) {
        const [archivedResponse] = first.archivedResponses;
        setVideoData({
          videoUrl: archivedResponse ? archivedResponse.response : null,
          currentQuestionText: archivedResponse ? archivedResponse.question : 'No Video Selected',
        });
      }
    });
  };

  useEffect(() => {
    getData();
  }, [archives]);

  // const rowSelection = {
  //   selectedRowKeys,
  //   columnWidth: 0,
  //   fixed: false,
  //   onChange: setSelectedRowKeys,
  // };
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
  const titleData = () => <span>Questions</span>;

  const buttonEnabled = (archives, candidateData) => {
    if (candidateData) {
      if (archives) {
        return candidateData.archivedResponses ? candidateData.archivedResponses.length : false;
      }
      return candidateData.responses ? candidateData.responses.length : false;
    }
    return null;
  };
  const extraData = () => (
    <>
      <ArchiveButton
        style={{ marginRight: 20 }}
        reload={getData}
        archives={archives}
        route={`videos/${candidateData._id}`}
        archiveData={[{ _id: activeQuestion }]}
        onClick={() => null}
        active={buttonEnabled(archives, candidateData)}
      />
      <a onClick={() => setArchives(!archives)}>
        {archives
          ? `View All (${candidateData.responses ? candidateData.responses.length : 0})`
          : `View Archived (${
              candidateData.archivedResponses ? candidateData.archivedResponses.length : 0
            })`}
      </a>
    </>
  );

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
        <Col xs={{ span: 24, order: 2 }} sm={24} md={10} lg={12} xl={10} xxl={10}>
          <InfoCardEditable
            userId={userId}
            userName={userName}
            interviewName={interviewName}
            email={candidateEmail}
            setVideoData={setVideoData}
          />

          <Card hoverable title={titleData()} extra={extraData()}>
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
              dataSource={!archives ? candidateData.responses : candidateData.archivedResponses}
              columns={columns}
              // rowSelection={rowSelection}
            />
          </Card>
        </Col>
        <Col
          xs={{ span: 24, order: 1 }}
          sm={{ span: 24, order: 1 }}
          md={{ span: 14, order: 2 }}
          lg={{ span: 12, order: 2 }}
          xl={{ span: 14, order: 2 }}
          xxl={{ span: 14, order: 2 }}
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
