import React, { useEffect } from 'react';
import { Typography } from 'antd';
import ClickHistory from './ClickHistory';
import CandidateAnalyticsTable from './CandidateAnalyticsTable';
import { lowerCaseQueryParams } from '@bit/russeii.deephire.utils.utils';
import AntPageHeader from '@/components/PageHeader/AntPageHeader';
import { useAsync } from '@/services/hooks';


import { getShortListData } from '@/services/api';

interface Click {
  clickTime: string,
  color: string,
  message: string
}

interface Interview {

  clicks: [string];
  liveInterviewData: { candidateName?: string; }
  userName?: string;
}

const getClickData = (data: any) => {
  if (!data) return null

  const { clicks, interviews, timestamp } = data


  const clickData: Click[] = [];

  clickData.push({
    clickTime: timestamp,
    color: 'grey',
    message: 'Created',
  });

  if (interviews) {
    interviews.forEach((interview: Interview) => {
      if (interview.clicks) {
        interview.clicks.forEach((clickTime: string) => {
          clickData.push({
            clickTime,
            color: 'green',
            message: `Viewed ${interview.userName || interview.liveInterviewData.candidateName}`,
          });
        })
      }
    })
  }
  if (clicks) {
    clicks.forEach((clickTime: string) => {
      clickData.push({
        clickTime,
        color: 'blue',
        message: 'Viewed link',
      });
    });
  }

  return clickData

}
const ShortListAnalytics = () => {
  const { id } = lowerCaseQueryParams(window.location.search);
  const { value: analyticsData, pending, execute } = useAsync(getShortListData, false);

  useEffect(() => {
    execute(id);
  }, [id]);

  const clickData = getClickData(analyticsData?.[0])


  return (
    <>
      <AntPageHeader
        title={analyticsData?.[0]?.name}
        subTitle={<Typography.Text copyable>{analyticsData?.[0]?.shortUrl}</Typography.Text>}
      />
      <CandidateAnalyticsTable
        pending={pending}
        analyticsData={analyticsData?.[0]}
        style={{ marginBottom: 24 }}
      />
      <ClickHistory
        pending={pending}
        clicks={clickData}
      />
    </>
  );
};

export default ShortListAnalytics;
