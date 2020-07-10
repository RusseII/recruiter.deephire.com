import React from 'react';
import { Avatar, Rate } from 'antd';
import StandardTable from '@/components/StandardTable';

const columns = [
  {
    title: 'Candidate',
    dataIndex: 'userName',
    render: (name, data) => {
      const { liveInterviewData } = data;
      if (!liveInterviewData) {
        const picture = data?.responses?.[0]?.thumbnail100x100;
        return (
          <div>
            <Avatar size="small" src={picture} alt="avatar" />
            <span style={{ marginLeft: 8 }}>{name}</span>
          </div>
        );
      }
      return liveInterviewData.candidateName;
    },
  },
  {
    title: 'Email',
    dataIndex: 'candidateEmail',
    render: (candidateEmail, data) => {
      const { liveInterviewData } = data;
      if (!liveInterviewData) return candidateEmail;
      return liveInterviewData.candidateEmail;
    },
  },
  {
    title: 'Rating',
    dataIndex: 'rating',
    render: rating => <Rate disabled defaultValue={rating} />,
  },
  {
    title: 'Views',
    dataIndex: 'clicks',
    render: clicks => <>{clicks ? clicks.length : '-'}</>,
  },
  {
    title: 'Feedback',
    dataIndex: 'feedback',
  },
];
const CandidateAnalyticsTable = props => {
  const { analyticsData, pending } = props;
  return (
    <StandardTable
      loading={pending}
      data={{ list: analyticsData?.interviews }}
      columns={columns}
      pagination={false}
      {...props}
    />
  );
};

export default CandidateAnalyticsTable;
