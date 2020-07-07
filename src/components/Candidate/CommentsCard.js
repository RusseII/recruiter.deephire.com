import React from 'react';

import { Card, Table, Skeleton, Tooltip, Button, Input, Typography, Form, message } from 'antd';

import { CloseCircleOutlined } from '@ant-design/icons';

import { formatTime } from '@/utils/utils';

import { addComment, removeComment } from '@/services/api';
import { useAsync } from '@/services/hooks';

// const titleData = () => <span>Questions</span>;

const QuestionCard = props => {
  const { liveInterviewData, duration, progress, videoRef } = props;

  const { pending, execute } = useAsync(addComment, false);
  if (liveInterviewData) {
    liveInterviewData.comments = [
      { _id: 123, comment: 'Why do you like this position?', time: 5 },
      { _id: 1234, comment: 'Tell me about yourself', time: 15 },
    ];
  }

  const SuccessDelete = ({ deleteData }) => {
    return (
      <>
        Deleted Bookmark
        <Button
          type="link"
          onClick={() => {
            addComment(liveInterviewData._id, deleteData, 'Undo Delete Succesful');
            message.destroy();
          }}
        >
          Undo
        </Button>
      </>
    );
  };

  const onFinish = values => {
    const { comment } = values;
    execute(liveInterviewData._id, comment, 'Succesfully Saved Bookmark');
  };

  //   const [activeQuestion, setActiveQuestion] = useState(0);

  const columns = [
    {
      title: 'time',
      dataIndex: 'time',
      key: 'time',
      width: 5,
      render: time => <a type="link">{formatTime(time)}</a>,
    },
    {
      title: 'Comments',
      dataIndex: 'comment',
      key: 'question',
    },
    {
      // title: 'Actions',
      dataIndex: '_id',
      key: '_id',
      fixed: 'right',
      width: 30,
      render: (_id, deleteData) => (
        <Tooltip title="Delete this bookmark">
          <CloseCircleOutlined
            onClick={() =>
              removeComment(liveInterviewData._id, _id, <SuccessDelete deleteData={deleteData} />)
            }
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
    <Card title="Bookmarks" {...props}>
      <Skeleton loading={!liveInterviewData} active>
        {liveInterviewData?.comments && (
          <Table
            rowKey="_id"
            style={{ marginBottom: 24 }}
            size="middle"
            showHeader={false}
            onRow={record => ({
              onClick: () => {
                const { time } = record;
                videoRef.current.seekTo(time, 'seconds');
              },
            })}
            // rowClassName={(record, index) => (record.time < progress.playedSeconds ? styles.selected : '')}
            pagination={false}
            dataSource={liveInterviewData?.comments}
            columns={columns}
          />
        )}

        <Form onFinish={onFinish}>
          <div style={{ position: 'relative' }}>
            <Form.Item style={{ marginBottom: 8 }} name="comment">
              <Input.TextArea
                autoSize={{ minRows: 1 }}
                placeholder="Add description for bookmark"
              />
            </Form.Item>
            <span style={{ position: 'absolute', right: 16, bottom: 8 }}>
              <Typography.Text type="secondary">
                {`${formatTime(progress.playedSeconds)} / ${formatTime(duration)}`}
              </Typography.Text>
            </span>
          </div>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button htmlType="submit" loading={pending}>
              Save Bookmark
            </Button>
          </Form.Item>
        </Form>
      </Skeleton>
    </Card>
  );
};
export default QuestionCard;
