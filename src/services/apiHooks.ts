import useSWR from 'swr';
import fetcher from '../fetcher';

interface LiveTypes {
  data: Data;
  isLoading: boolean;
  isError: boolean;
  mutate?: any;
}

interface Data {
  _id: string;
  interviewType: 'recruiter' | 'client';
  candidateName: string;
  candidateEmail: string;
  interviewTime?: string[] | null;
  jobName?: string;
  phone?: string;
  recruiterTemplate?: string;
  createdBy: string;
  companyId: string;
  roomName: string;
  interviewLink: string;
  companyName: string;
  recruiterName: string;
  timestamp: string;
  clientTemplate?: string;
  recording: boolean;
  participants: any;
}

export const useLive = (id: string): LiveTypes => {
  const { data, error, mutate } = useSWR(id ? [`/v1/live/${id}`] : null, fetcher);

  return {
    data,
    isLoading: !error && !data && id != null,
    isError: error,
    mutate,
  };
};

export const useLives = (): LiveTypes => {
  const { data, error } = useSWR([`/v1/live`], fetcher);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};



export const useVideo = (id: string): LiveTypes => {
    const { data, error, mutate } = useSWR(id ? [`/v1/videos/${id}`] : null, fetcher);
  
    return {
      data,
      isLoading: !error && !data && id != null,
      isError: error,
      mutate,
    };
  };

  export const useVideos = (): LiveTypes => {
    const { data, error } = useSWR([`/v1/videos`], fetcher);
    const sortedData = data?.sort((a: any, b: any) => (new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1));
    return {
      data: sortedData,
      isLoading: !error && !data,
      isError: error,
    };
  };
  export const useVideosArchives = (): LiveTypes => {
    const { data, error } = useSWR([`/v1/videos/arhives`], fetcher);
    const sortedData = data?.sort((a: any, b: any) => (new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1));
    return {
      data: sortedData,
      isLoading: !error && !data,
      isError: error,
    };
  };

  export const useCompany = (): LiveTypes => {
    const { data, error } = useSWR([`/v1/companies`], fetcher);
    return {
      data,
      isLoading: !error && !data,
      isError: error,
    };
  };

  export const useShortlists = (): LiveTypes => {
    const { data, error } = useSWR([`/v1/shortlists`], fetcher);
    return {
      data,
      isLoading: !error && !data,
      isError: error,
    };
  };

  export const useShortlistsArchives = (): LiveTypes => {
    const { data, error } = useSWR([`/v1/shortlists/archives`], fetcher);
    return {
      data,
      isLoading: !error && !data,
      isError: error,
    };
  };
  export const useShortlist = (id: string): LiveTypes => {
    const { data, error, mutate } = useSWR(id ? [`/v1/shortlists/${id}`] : null, fetcher);
    return {
      data,
      isLoading: !error && !data && id != null,
      isError: error,
      mutate,
    };
  };


  export const useJobs = (): LiveTypes => {
    const { data, error } = useSWR([`/v1/interviews`], fetcher);
    return {
      data,
      isLoading: !error && !data,
      isError: error,
    };
  };

  export const useJobsArchives = (): LiveTypes => {
    const { data, error } = useSWR([`/v1/interviews/archives`], fetcher);
    return {
      data,
      isLoading: !error && !data,
      isError: error,
    };
  };
  export const useJob = (id: string): LiveTypes => {
    const { data, error, mutate } = useSWR(id ? [`/v1/interviews/${id}`] : null, fetcher);
    return {
      data,
      isLoading: !error && !data && id != null,
      isError: error,
      mutate,
    };
  };
  
