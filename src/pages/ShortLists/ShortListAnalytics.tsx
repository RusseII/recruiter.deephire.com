import React from 'react';
import { Typography } from 'antd';
import { lowerCaseQueryParams } from '@bit/russeii.deephire.utils.utils';
// eslint-disable-next-line import/no-unresolved
import ClickHistory from './ClickHistory';
import CandidateAnalyticsTable from './CandidateAnalyticsTable';
import AntPageHeader from '@/components/PageHeader/AntPageHeader';
import {useShortlist} from '@/services/apiHooks'



interface Click {
  clickTime: string;
  color: string;
  message: string;
  name?: string;
}

interface TrackedClick {
  name: string;
  timestamp: string
}

const getClickData = (data: any) => {
  if (!data) return null

  const { trackedClicks, timestamp } = data


  const clickData: Click[] = [];

  clickData.push({
    clickTime: timestamp,
    color: 'grey',
    message: 'Created',
  });


  if (trackedClicks) {
    trackedClicks.forEach((click: TrackedClick) => {
      clickData.push({
        name: click.name,
        clickTime: click.timestamp,
        color: 'blue',
        message: `${click.name} viewed link`,
      });
    });
  }


  return clickData

}
const ShortListAnalytics = () => {
  const { id } = lowerCaseQueryParams(window.location.search);

  const {data: analyticsData, isLoading } = useShortlist(id)


  // eslint-disable-next-line prettier/prettier
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
