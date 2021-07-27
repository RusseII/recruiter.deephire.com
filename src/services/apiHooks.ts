import useSWR from 'swr';
import fetcher from '../fetcher';

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


interface LiveTypes {
  data: Data;
  isLoading: boolean;
  isError: boolean;
  mutate?: any;
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
  const { data, error, mutate } = useSWR([`/v1/live`], fetcher);
  // eslint-disable-next-line prettier/prettier
  const sortedData = data?.sort((a: any, b: any) => 
  { 
    return new Date(b.interviewTime[0]).getTime() - new Date(a.interviewTime[0]).getTime()
  });

  return {
    data: sortedData,
    isLoading: !error && !data,
    isError: error,
    mutate
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
    const { data, error, mutate } = useSWR([`/v1/companies`], fetcher);
    return {
      data,
      isLoading: !error && !data,
      isError: error,
      mutate,
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
    const { data, error, mutate } = useSWR([`/v1/interviews`], fetcher);
    return {
      data,
      isLoading: !error && !data,
      isError: error,
      mutate,
    };
  };

  export const useJobsArchives = (): LiveTypes => {
    const { data, error, mutate } = useSWR([`/v1/interviews/archives`], fetcher);
    return {
      data,
      isLoading: !error && !data,
      isError: error,
      mutate
    };
  };
  export const useJob = (id: string): LiveTypes => {
    const { data, error, mutate } = useSWR(id ? [`/v1/interviews/${id}`] : null, fetcher, {refreshInterval: 5000});
    return {
      data,
      isLoading: !error && !data && id != null,
      isError: error,
      mutate,
    };
  };
  


  export const useLiveTemplates = (): LiveTypes => {
    const { data, error } = useSWR([`/v1/live/templates`], fetcher, {shouldRetryOnError: false});
    return {
      data,
      isLoading: !error && !data,
      isError: error,
    };
  };

  
  // const initialData = {
  //   email: 'apple@deephire.com',
  //   name: 'apple@deephire.com',
  //   user_id: 'auth0|5fc900265bddd2006e2f37d1',
  //   app_metadata: {
  //     companyId: '5e95d7d3aed1120001480d69',
  //     role: 'admin',
  //     team: ['Raleigh'],
  //   },
  // }

  export const useRecruiter = (): LiveTypes => {
    const { data, error } = useSWR(['/v1/profiles'], fetcher);
    return {
      data,
      isLoading: !error && !data,
      isError: error,
    };
  };

  export const useEventSummary = ( id: string, startDate: number = 0, endDate: number = Date.now()) : LiveTypes => {
    const { data, error } = useSWR([`/v1/events/${id}/?startDate=${startDate}&endDate=${endDate}`], fetcher);
    return {
      data,
      isLoading: !error && !data,
      isError: error
    }
  }

  export const useSortedEvents = ( id: string, page: number, 
    limit: number = 100, startDate: number = 0, endDate: number = Date.now(), 
    sortItem: string = 'timestamp', sortOrder: number = 1) : LiveTypes => {
      const key = `/v1/events/${id}/sort?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&sortItem=${sortItem}&sortOrder=${sortOrder}`;
      const { data, error } = useSWR([key], fetcher);
      return {
        data,
        isLoading: !error && !data,
        isError: error
      }
  }

  export const useSummary = (startDate: number, endDate: number) : LiveTypes => {

 
    const { data, error, mutate } = useSWR([`/v1/events/summary?startDate=${startDate}&endDate=${endDate}`], fetcher);
    return {
      data,
      isLoading: !error && !data,
      isError: error,
      mutate
    }
  };