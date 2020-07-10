import React from 'react';

import { Card, Table, Skeleton, Tooltip, Button, Input, Typography, Form, message } from 'antd';

import { CloseCircleOutlined } from '@ant-design/icons';

import { formatTime } from '@/utils/utils';

import { addComment, removeComment } from '@/services/api';
import { useAsync } from '@/services/hooks';

// const titleData = () => <span>Questions</span>;

const QuestionCard = props => {
  const {
    liveInterviewData,
    duration,
    progress,
    videoRef,
    setReload,
    setControlKeys,
    setPlaying,
  } = props;
  const [form] = Form.useForm();
  const { pending, execute } = useAsync(addComment, false);

  const SuccessDelete = ({ deleteData }) => {
    return (
      <>
        Deleted Bookmark
        <Button
          type="link"
          onClick={() => {
            addComment(liveInterviewData._id, deleteData, 'Undo Delete Succesful');
            message.destroy();
            setReload(flag => !flag);
          }}
        >
          Undo
        </Button>
      </>
    );
  };

  const onFinish = async values => {
    const { comment } = values;
    await execute(
      liveInterviewData._id,
      { comment, time: progress.playedSeconds },
      'Succesfully Saved Bookmark'
    );
    setReload(flag => !flag);
    form.resetFields();
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
            onClick={async () => {
              await removeComment(
                liveInterviewData._id,
                _id,
                <SuccessDelete deleteData={deleteData} />
              );
              setReload(flag => !flag);
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
