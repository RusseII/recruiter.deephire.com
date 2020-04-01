import React, { useState } from 'react';

import { Card, Table, Skeleton } from 'antd';

import styles from './index.less';
import { getVideo } from '@/services/api';
import ArchiveButton from '@/components/ArchiveButton';

const columns = [
  {
    title: 'Questions',
    dataIndex: 'question',
    key: 'question',
  },
];

const titleData = () => <span>Questions</span>;

const buttonEnabled = (archives, candidateData, responses, archivedResponses) => {
  if (candidateData) {
    if (archives) {
      return archivedResponses ? candidateData.archivedResponses.length : false;
    }
    return responses ? candidateData.responses.length : false;
  }
  return null;
};

const QuestionCard = ({ candidateData, setVideoData, id, setCandidateData }) => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [archives, setArchives] = useState(false);

  const getArchiveData = async () => {
    await getVideo(id).then(data => {
      const [first] = data;
      setCandidateData(first);
      //   return first;
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

  const { responses, archivedResponses } = candidateData || {};

  const extraData = () => (
    <>
      <ArchiveButton
        style={{ marginRight: 20 }}
        reload={getArchiveData}
        archives={archives}
        route={`videos/${candidateData?._id}`}
        archiveData={[{ _id: activeQuestion }]}
        onClick={() => null}
        active={buttonEnabled(archives, candidateData, responses, archivedResponses)}
      />
      <a onClick={() => setArchives(archives => !archives)}>
        {archives
          ? `View All (${responses ? candidateData.responses.length : 0})`
          : `View Archived (${archivedResponses ? candidateData.archivedResponses.length : 0})`}
      </a>
    </>
  );

  return (
    <Card hoverable title={titleData()} extra={extraData()}>
      <Skeleton loading={!candidateData} active>
        <Table
          showHeader={false}
          onRow={(record, index) => ({
            onClick: () => {
              if (archives) {
                const videoUrl = archivedResponses[index].response;
                const currentQuestionText = archivedResponses[index].question;
                setVideoData({ videoUrl, currentQuestionText });
              } else {
                const videoUrl = responses[index].response;
                const currentQuestionText = responses[index].question;
                setVideoData({ videoUrl, currentQuestionText });
              }

              setActiveQuestion(index);
            },
          })}
          rowClassName={(record, index) => (index === activeQuestion ? styles.selected : '')}
          pagination={false}
          bordered
          dataSource={!archives ? responses : archivedResponses}
          columns={columns}
        />
      </Skeleton>
    </Card>
  );
};
export default QuestionCard;
