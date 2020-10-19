import React from 'react';

import { Card, Table, Skeleton, Tooltip, Button, Input, Typography, Form, message } from 'antd';

import { CloseCircleOutlined } from '@ant-design/icons';

import { formatTime } from '@bit/russeii.deephire.utils.utils';

import { useAsync } from '@bit/russeii.deephire.hooks';

// const titleData = () => <span>Questions</span>;

const QuestionCard = props => {
  const {
    mutate,
    liveInterviewData,
    duration,
    progress,
    videoRef,
    setControlKeys,
    setPlaying,
    editable,
  } = props;

  const { addComment, removeComment } = editable || {};
  const [form] = Form.useForm();
  const { pending, execute } = useAsync(addComment, false);

  const SuccessDelete = ({ deleteData }) => {
    return (
      <>
        Deleted Bookmark
        <Button
          type="link"
          onClick={async () => {
            await addComment(liveInterviewData._id, deleteData, 'Undo Delete Succesful');
            message.destroy();
            mutate();
          }}
        >
          Undo
        </Button>
      </>
    );
  };

  const onFinish = async values => {
    const { comment } = values;

    const commentData = { comment, time: progress.playedSeconds };

    const mutableInterviewData = { ...liveInterviewData };

    mutableInterviewData.comments = [...(mutableInterviewData.comments || []), commentData];
    mutate(mutableInterviewData, false);
    form.resetFields();

    await execute(liveInterviewData._id, commentData, 'Succesfully Saved Bookmark');
    mutate();

    // setReload(flag => !flag);
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
      render: (_id, deleteData) =>
        editable && (
          <Tooltip title="Delete this bookmark">
            <CloseCircleOutlined
              onClick={async () => {
                const simplifiedComments = liveInterviewData.comments.filter(
                  comment => comment._id !== _id
                );
                mutate({ ...liveInterviewData, comments: simplifiedComments }, false);
                await removeComment(
                  liveInterviewData._id,
                  _id,
                  <SuccessDelete deleteData={deleteData} />
                );
                mutate();
              }}
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
        {liveInterviewData?.comments && liveInterviewData?.comments.length !== 0 && (
          <Table
            rowKey="_id"
            style={{ marginBottom: 24 }}
            size="middle"
            showHeader={false}
            onRow={record => ({
              onClick: () => {
                const { time } = record;
                videoRef.current.seekTo(time, 'seconds');
                setPlaying(true);
              },
            })}
            // rowClassName={(record, index) => (record.time < progress.playedSeconds ? styles.selected : '')}
            pagination={false}
            dataSource={liveInterviewData?.comments.sort((a, b) => a.time - b.time)}
            columns={columns}
          />
        )}

        {editable && (
          <Form form={form} onFinish={onFinish}>
            <div style={{ position: 'relative' }}>
              <Form.Item
                rules={[{ required: true, message: 'Please enter bookmark message' }]}
                style={{ marginBottom: 8 }}
                name="comment"
              >
                <Input.TextArea
                  onFocus={() => setControlKeys(false)}
                  onBlur={() => setControlKeys(true)}
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
              <Button loading={pending} htmlType="submit">
                Save Bookmark
              </Button>
            </Form.Item>
          </Form>
        )}
      </Skeleton>
    </Card>
  );
};
export default QuestionCard;
