import React from 'react';
import moment from 'moment';
import { useLives, useVideos, useShortlists, useJobs } from '@/services/apiHooks';

function onCurrentWeek(date) {
  return moment(date).isSame('2020-12-17', 'week');
}

export default () => {
  const { data: livesData, isLoading: isLoadingLives } = useLives();
  const { data: videosData, isLoading: isLoadingVideos } = useVideos();
  const { data: shortlistsData, isLoading: isLoadingShortlists } = useShortlists();
  const { data: jobsData, isLoading: isLoadingJobs } = useJobs();

  const lwLivesData = livesData?.filter(r => onCurrentWeek(r.timestamp));
  const lwVideosData = videosData?.filter(r => onCurrentWeek(r.timestamp));
  const lwShortlistsData = shortlistsData?.filter(r => onCurrentWeek(r.timestamp));
  const lwJobsData = jobsData?.filter(r => onCurrentWeek(r.timestamp));
  const liveCreatedViaApi = lwLivesData?.filter(r => r.recruiterCompany != null);

  const clientInterviews = lwLivesData?.filter(r => r.interviewType === 'client');
  const clientInterviewsRecorded = clientInterviews?.filter(r => r.recordingUrl != null);
  const recruiterInterviews = lwLivesData?.filter(r => r.interviewType === 'recruiter');
  const recruiterInterviewsRecorded = recruiterInterviews?.filter(r => r.recordingUrl != null);

  console.log({ lwLivesData, lwShortlistsData, lwJobsData, lwVideosData });
  //   livesData,
  //   videosData,
  //   shortlistsData,
  //   jobsData,
  //   lwLivesData,
  //   lwJobsData,
  //   lwShortlistsData,
  //   lwVideosData,
  //   // lw,
  // });

  return (
    <>
      <div>{liveCreatedViaApi?.length}</div>
      <div>{clientInterviews?.length}</div>
      <div>{clientInterviewsRecorded?.length}</div>
      <div>{recruiterInterviews?.length}</div>
      <div>{recruiterInterviewsRecorded?.length}</div>
    </>
  );
};
