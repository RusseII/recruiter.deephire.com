import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { getInterviews, getArchivedInterviews, updateInterviews } from '@/services/api';
import { message, Row, Col, Card, Tooltip, Modal } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import readableTime from 'readable-timestamp';
import ArchiveButton from '@/components/ArchiveButton';
import CloneButton from '@/components/CloneButton';

import Step1 from '@/pages/Interviews/CreateInterviewForm/Step1';
import { getHttpUrl } from '@/utils/utils';

const TableList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [archives, setArchives] = useState(false);
  const [editInterview, setEditInterview] = useState(null);

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
      title: 'Created',
      sorter: true,
      render(test, data) {
        try {
          const dateObj = new Date(data.timestamp);
          const displayTime = readableTime(dateObj);
          return <div>{displayTime}</div>;
        } catch {
          return null;
        }
      },
    },
    {
      title: 'Interview Link (send this to candidates)',
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

    {
      title: 'Edit',
      render: (text, data) => <a onClick={() => setEditInterview(data)}>Edit</a>,
    },
  ];

  const getData = async () => {
    setLoading(true);
    const profile = JSON.parse(localStorage.getItem('profile'));
    const { email } = profile;
    const data = await (archives ? getArchivedInterviews(email) : getInterviews(email));
    setData(data || []);
    setLoading(false);
  };
  useEffect(() => {
    getData();
  }, [archives, editInterview]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <PageHeaderWrapper title="Interviews">
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
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          data={{ list: data }}
          size="small"
          columns={columns}
          onSelectRow={rows => setSelectedRows(rows)}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default TableList;
