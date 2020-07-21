import React, { useState } from 'react';

import { Card, Table, Skeleton, Tooltip } from 'antd';

import './index.css';

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
  const { candidateData, setVideoUrl, setReload, setPlaying, ArchiveButton, editable } = props;

  const { archives, setArchives } = editable || {};
  const [activeQuestion, setActiveQuestion] = useState(0);

  const { responses, archivedResponses } = candidateData || {};

  const columns = [
    {
      title: 'Questions',
      dataIndex: 'question',
      key: 'question',
    },
    {
      dataIndex: '_id',
      key: '_id',
      width: 100,
      render: () =>
        editable && (
          <Tooltip title="Hide question when sharing this candidate">
            <ArchiveButton
              style={{ marginRight: 20 }}
              reload={() => setReload(flag => !flag)}
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

  return (
    <Card
      title={editable ? null : 'Questions'}
      tabList={
        editable
          ? [
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
            ]
          : null
      }
      onTabChange={() => setArchives(archives => !archives)}
      {...props}
    >
      <Skeleton loading={!candidateData} active>
        <Table
          size="middle"
          showHeader={false}
          onRow={(record, index) => {
            return {
              onClick: () => {
                setPlaying(true);
                if (archives) {
                  const videoUrl = archivedResponses[index].response;
                  setVideoUrl(videoUrl);
                } else {
                  const videoUrl = responses[index].response;
                  setVideoUrl(videoUrl);
                }

                setActiveQuestion(index);
              },
            };
          }}
          rowClassName={(record, index) => (index === activeQuestion ? 'question-selected' : '')}
          pagination={false}
          dataSource={!archives ? responses : archivedResponses}
          columns={columns}
        />
      </Skeleton>
    </Card>
  );
};
export default QuestionCard;
