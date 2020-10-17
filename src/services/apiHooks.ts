import useSWR from 'swr';
import fetcher from '../fetcher';

interface ParamTypes {
    URLRoomName: string;
  }
  
  interface LiveTypes {
    data: Data;
    isLoading: boolean;
    isError: boolean;
    mutate: any;
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

export const useLive = (id: string) : LiveTypes => {
    
    console.log(`/v1/live/${id}`)
    const { data, error, mutate } = useSWR(id ? [`/v1/live/${id}`] : null, fetcher);
  
    return {
      data,
      isLoading: !error && !data && id != null,
      isError: error,
      mutate
    };
  };
  