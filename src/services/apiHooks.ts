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


const initialData = [
  {
     "_id":"5fc5213c25ded8001a599611",
     "name":"Test Can",
     "hideInfo":false,
     "requireName":true,
     "trackedClicks":[
        {
           "name":"russell",
           "timestamp":"12323"
        }
     ],
     "viewedBy":{
        "russell":{
           "rating":5,
           "feedback":"Good Candidate"
        }
     },
     "interviews":[
        {
           "_id":"5f977729bce234a432852e60",
           "candidateEmail":"russell@deephire.com",
           "interviewId":"5f9776d8653d89001a1b21a1",
           "completeInterviewData":{
              "interviewData":{
                 "_id":"5f9776d8653d89001a1b21a1",
                 "createdByTeam":"PT",
                 "interviewName":"Software Engineer",
                 "interviewQuestions":[
                    {
                       "question":"Give an example of a time that you worked through a difficult problem. "
                    },
                    {
                       "question":"Give an example of a time that you worked through a difficult problem.  How did you resolve it? "
                    }
                 ],
                 "interviewConfig":{
                    "retakesAllowed":8,
                    "prepTime":45,
                    "answerTime":80
                 },
                 "createdBy":"benji@deephire.com",
                 "shortUrl":"interview.deephire.com/lqj",
                 "companyId":"5dc5d305a4ea435efa57f644",
                 "longUrl":"https://interviews.deephire.com/?id=5f9776d8653d89001a1b21a1",
                 "timestamp":"Tue Oct 27 2020 01:24:40 GMT+0000 (Coordinated Universal Time)"
              },
              "companyData":{
                 "_id":"5dc5d305a4ea435efa57f644",
                 "owner":"russell@deephire.com",
                 "plan":"basic-monthly-v1",
                 "companyName":"DeepHire",
                 "logo":"https://s3.amazonaws.com/deephire.data.public/companies/5dc5d305a4ea435efa57f644/dh-colored_(2).png",
                 "stripeCustomerId":"cus_GSgccCEHLo2zRH",
                 "clockworkIntegration":{
                    "apiKey":"ad5ea3b3-a0d5-4c1a-b4e4-b773037da7ae",
                    "apiSecret":"3b5bb6cf-1760-4566-a54f-364a2cbc6835",
                    "firmKey":"p4hdaRFS7c1llyUm9U6ra71JcsVymNm79PskuxMo",
                    "firmName":"glagnor"
                 },
                 "billing":"russell@deephire.com",
                 "teams":[
                    {
                       "team":"IT"
                    },
                    {
                       "team":"Banking"
                    },
                    {
                       "team":"PT"
                    },
                    {
                       "team":"Engineering"
                    }
                 ]
              }
           },
           "interviewName":"Software Engineer",
           "responses":[
              {
                 "question":"Give an example of a time that you worked through a difficult problem. ",
                 "thumbnail640x480":"//www.cameratag.com/assets/v-1b98cac5-fe86-45fb-993a-9c69706d09ca/thumbnail640x480.jpg",
                 "response":"//www.cameratag.com/assets/v-1b98cac5-fe86-45fb-993a-9c69706d09ca/response.mp4",
                 "filmstrip":"//www.cameratag.com/assets/v-1b98cac5-fe86-45fb-993a-9c69706d09ca/filmstrip.jpg",
                 "thumbnail200x200":"//www.cameratag.com/assets/v-1b98cac5-fe86-45fb-993a-9c69706d09ca/thumbnail200x200.jpg",
                 "thumbnail100x100":"//www.cameratag.com/assets/v-1b98cac5-fe86-45fb-993a-9c69706d09ca/thumbnail100x100.jpg",
                 "thumbnail50x50":"//www.cameratag.com/assets/v-1b98cac5-fe86-45fb-993a-9c69706d09ca/thumbnail50x50.jpg",
                 "uuid":"v-1b98cac5-fe86-45fb-993a-9c69706d09ca"
              },
              {
                 "question":"Give an example of a time that you worked through a difficult problem.  How did you resolve it? ",
                 "thumbnail640x480":"//www.cameratag.com/assets/v-8c89be27-b350-4d51-8993-a070f4cd9f2f/thumbnail640x480.jpg",
                 "response":"//www.cameratag.com/assets/v-8c89be27-b350-4d51-8993-a070f4cd9f2f/response.mp4",
                 "filmstrip":"//www.cameratag.com/assets/v-8c89be27-b350-4d51-8993-a070f4cd9f2f/filmstrip.jpg",
                 "thumbnail200x200":"//www.cameratag.com/assets/v-8c89be27-b350-4d51-8993-a070f4cd9f2f/thumbnail200x200.jpg",
                 "thumbnail100x100":"//www.cameratag.com/assets/v-8c89be27-b350-4d51-8993-a070f4cd9f2f/thumbnail100x100.jpg",
                 "thumbnail50x50":"//www.cameratag.com/assets/v-8c89be27-b350-4d51-8993-a070f4cd9f2f/thumbnail50x50.jpg",
                 "uuid":"v-8c89be27-b350-4d51-8993-a070f4cd9f2f"
              }
           ],
           "timestamp":"Tue Oct 27 2020 01:26:01 GMT+0000 (Coordinated Universal Time)",
           "userId":"russell@deephire.com",
           "userName":"Russell Ratcliffe"
        }
     ],
     "createdByTeam":"PT",
     "createdBy":"benji@deephire.com",
     "shortUrl":"share.deephire.com/y0t",
     "companyId":"5dc5d305a4ea435efa57f644",
     "timestamp":"Mon Nov 30 2020 16:43:40 GMT+0000 (Coordinated Universal Time)"
  }
]

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
    const { data, error, mutate } = useSWR(id ? [`/v1/shortlists/${id}`] : null, fetcher, {initialData});
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