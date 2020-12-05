import React from 'react';
import { Typography } from 'antd';
import ClickHistory from './ClickHistory';
import CandidateAnalyticsTable from './CandidateAnalyticsTable';
import { lowerCaseQueryParams } from '@bit/russeii.deephire.utils.utils';
import AntPageHeader from '@/components/PageHeader/AntPageHeader';
import {useShortlist} from '@/services/apiHooks'



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

  const {data: analyticsData, isLoading } = useShortlist(id)


  const clickData = getClickData(analyticsData?.[0])


  return (
    <>
      <AntPageHeader
        title={analyticsData?.[0]?.name}
        subTitle={<Typography.Text copyable>{analyticsData?.[0]?.shortUrl}</Typography.Text>}
      />
      <CandidateAnalyticsTable
        pending={isLoading}
        analyticsData={analyticsData?.[0]}
        style={{ marginBottom: 24 }}
      />
      <ClickHistory
        pending={isLoading}
        clicks={clickData}
      />
    </>
  );
};

export default ShortListAnalytics;
