import React, { useState } from 'react';

import { Card, Table, Skeleton, Tooltip } from 'antd';

import styles from './index.less';
import { getVideo } from '@/services/api';
import ArchiveButton from '@/components/ArchiveButton';

// const titleData = () => <span>Questions</span>;

const buttonEnabled = (archives, candidateData, responses, archivedResponses) => {
  if (candidateData) {
    if (archives) {
      return archivedResponses ? candidateData.archivedResponses.length : false;
    }
    return responses ? candidateData.responses.length : false;
  }
  return null;
};

const QuestionCard = props => {
  const { candidateData, setVideoData, id, setCandidateData } = props;
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

  const columns = [
    {
      title: 'Questions',
      dataIndex: 'question',
      key: 'question',
    },
    {
      // title: 'Actions',
      dataIndex: '_id',
      key: '_id',
      render: () => (
        <Tooltip title="Hide question when sharing this candidate">
          <ArchiveButton
            style={{ marginRight: 20 }}
            reload={getArchiveData}
            archives={archives}
            route={`videos/${candidateData?._id}`}
            archiveData={[{ _id: activeQuestion }]}
            onClick={() => null}
            active={buttonEnabled(archives, candidateData, responses, archivedResponses)}
          />
        </Tooltip>
      ),
    },
  ];
  // const extraData = () => (
  //   <>
  //     <ArchiveButton
  //       style={{ marginRight: 20 }}
  //       reload={getArchiveData}
  //       archives={archives}
  //       route={`videos/${candidateData?._id}`}
  //       archiveData={[{ _id: activeQuestion }]}
  //       onClick={() => null}
  //       active={buttonEnabled(archives, candidateData, responses, archivedResponses)}
  //     />
  //     {/* <a onClick={() => setArchives(archives => !archives)}>
  //       {archives
  //         ? `View All (${responses ? candidateData.responses.length : 0})`
  //         : `View Hidden (${archivedResponses ? candidateData.archivedResponses.length : 0})`}
  //     </a> */}
  //   </>
  // );

  return (
    <Card
      tabList={[
        {
          key: '1',
          tab: `Visible Questions`,
        },
        {
          key: '2',
          tab: `Hidden Questions ${
            archivedResponses && archivedResponses.length
              ? `(${candidateData.archivedResponses.length})`
              : ''
          }`,
        },
      ]}
      // extra="More"
      onTabChange={() => setArchives(archives => !archives)}
      {...props}
    >
      <Skeleton loading={!candidateData} active>
        <Table
          size="middle"
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
          // bordered
          dataSource={!archives ? responses : archivedResponses}
          columns={columns}
        />
      </Skeleton>
    </Card>
  );
};
export default QuestionCard;
