import {
  message,
  Row,
  Col,
  Card,
  Tooltip,
  Modal,
  Upload,
  Icon,
  Result,
  ConfigProvider,
} from 'antd';
import React, { Fragment, useEffect, useState, useContext } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import readableTime from 'readable-timestamp';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { getInterviews, getArchivedInterviews, updateInterviews } from '@/services/api';
import ArchiveButton from '@/components/ArchiveButton';
import customEmpty from '@/components/CustomEmpty';

import CloneButton from '@/components/CloneButton';

import Step1 from '@/pages/Interviews/CreateInterviewForm/Step1';
import { getHttpUrl } from '@/utils/utils';
import GlobalContext from '@/layouts/MenuContext';

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      // eslint-disable-next-line no-console
      console.log('uploaded');
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
const profile = JSON.parse(localStorage.getItem('profile'));
const { email } = profile;

const TableList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [archives, setArchives] = useState(false);
  const [editInterview, setEditInterview] = useState(null);
  const [inviteCandidates, setInviteCandidates] = useState(null);
  const [finished, setFinished] = useState(false);

  const globalData = useContext(GlobalContext);

  const updateInterview = async cleanedValueData => {
    await updateInterviews(editInterview._id, cleanedValueData);
    setEditInterview(null);
    message.success('Interview Updated');
  };
  const columns = [
    {
      title: 'Interview Name',
      dataIndex: 'interviewName',
    },

    {
      title: 'Interview Questions',
      render(x, data) {
        try {
          const listItems = data.interviewQuestions.map(d => (
            <div>
              <li key={d.question}>{d.question}</li>
              <br />
            </div>
          ));
          return <div>{listItems} </div>;
        } catch {
          return null;
        }
      },
    },
    {
      title: 'Created By',
      render(test, data) {
        const { createdBy } = data;
        try {
          const dateObj = new Date(data.timestamp);
          const displayTime = readableTime(dateObj);
          return (
            <>
              <div>{createdBy}</div>
              <div>{displayTime}</div>
            </>
          );
        } catch {
          return createdBy;
        }
      },
    },

    {
      title: email === 'demo@deephire.com' ? 'Invite' : null,
      render: () =>
        email === 'demo@deephire.com' ? (
          <a onClick={() => setInviteCandidates(true)}>Invite</a>
        ) : null,
    },

    {
      title: 'Edit',
      render: (text, data) => <a onClick={() => setEditInterview(data)}>Edit</a>,
    },
    {
      title: 'Interview Link',
      fixed: 'right',
      render: (text, data) => (
        <Fragment>
          <Tooltip title="Click to copy">
            <CopyToClipboard
              text={getHttpUrl(data.shortUrl)}
              onCopy={() => message.success('Link Copied')}
            >
              <a>{data.shortUrl || '-'}</a>
            </CopyToClipboard>
          </Tooltip>
        </Fragment>
      ),
    },
  ];

  const getData = async () => {
    setLoading(true);
    const profile = JSON.parse(localStorage.getItem('profile'));
    const { email } = profile;
    const data = await (archives ? getArchivedInterviews(email) : getInterviews(email));
    globalData.setInterviews(data || []);
    setLoading(false);
  };
  useEffect(() => {
    getData();
  }, [archives, editInterview]);

  useEffect(() => {
    getData();
  }, []);

  const reset = () => {
    setInviteCandidates(false);
    setFinished(false);
  };
  return (
    <PageHeaderWrapper title="Interviews">
      <Modal
        title="Invite Candidates"
        visible={Boolean(inviteCandidates)}
        onCancel={() => reset()}
        onOk={() => (!finished ? setFinished(true) : reset())}
        okText={!finished ? 'Invite Candidates' : 'Finish'}
        // footer={(!finished)}

        // width={window.innerWidth > 500 ? '60vw' : null}
      >
        {!finished ? (
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Upload a CSV or excel file that contains your
              candidate&apos;s email addresses.
            </p>
          </Dragger>
        ) : (
          <Result
            status="success"
            title="Successfully Invited Candidates"
            subTitle="Check with your account manager to view progress and analytics"
          />
        )}
      </Modal>
      {editInterview && (
        <Modal
          title="Edit Interview"
          visible={Boolean(editInterview)}
          onCancel={() => setEditInterview(false)}
          footer={null}
          width={window.innerWidth > 500 ? '60vw' : null}
        >
          <Step1 onClick={updateInterview} data={editInterview} />
        </Modal>
      )}
      <Card>
        <Row align="middle" type="flex" justify="space-between">
          <Col>
            {selectedRows.length !== 0 && (
              <>
                <ArchiveButton
                  onClick={() => setSelectedRows([])}
                  reload={getData}
                  archives={archives}
                  route="interviews"
                  archiveData={selectedRows}
                />
                <CloneButton
                  onClick={() => setSelectedRows([])}
                  reload={getData}
                  cloneData={selectedRows}
                />
              </>
            )}
          </Col>
          <a onClick={() => setArchives(!archives)}>{archives ? 'View All' : 'View Archived'} </a>
        </Row>
      </Card>

      <Card bordered={false}>
        <ConfigProvider
          renderEmpty={() =>
            customEmpty('No Interviews', '/interview/create-interview/info', 'Create Interview Now')
          }
        >
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={{ list: globalData.interviews }}
            // size="small"
            columns={columns}
            onSelectRow={rows => setSelectedRows(rows)}
          />
        </ConfigProvider>
      </Card>
    </PageHeaderWrapper>
  );
};

export default TableList;
