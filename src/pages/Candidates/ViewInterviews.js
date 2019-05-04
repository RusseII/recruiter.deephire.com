import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { getInterviews } from '@/services/api';
import { Card, message, Tooltip } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import readableTime from 'readable-timestamp';

const columns = [
  {
    title: 'Interview Name',
    dataIndex: 'interviewName',
  },
  {
    title: 'Interview Questions',
    render(x, data) {
      try {
        const listItems = data.interview_questions.map(d => (
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
        const dateObj = new Date(data.python_datetime);
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
          <CopyToClipboard text={data.short_url} onCopy={() => message.success('Link Copied')}>
            <a>{data.short_url || '-'}</a>
          </CopyToClipboard>
        </Tooltip>
      </Fragment>
    ),
  },
];

const TableList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getData = async () => {
    setLoading(true);
    const profile = JSON.parse(localStorage.getItem('profile'));
    const { email } = profile;
    const data = await getInterviews(email);
    setData(data);
    setLoading(false);
  };

  useEffect(() => getData(), []);

  return (
    <PageHeaderWrapper title="Interviews">
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
