import { stringify } from 'qs';
import request from '@/utils/request';


const hostedURL = 'https://api.deephire.com';

// const hostedURL = 'http://localhost:3001';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  console.log(params);
  return request(`/api/rule?${stringify(params)}`);
}
export async function queryRule2(params) {
  console.log(params);
  console.log(stringify(params));
  if (params == null) {
    // params = 'test@gmail.com';
    // console.log(JSON.stringify(params));
    return null;
  }
  return request(`${hostedURL}/v1.0/get_candidates/${params}`);
}

export async function shareShortLink(data) {
  console.log('ran');
  console.log('data');
  const x = request(`${hostedURL}/v1.0/create_shortlist`, {
    method: 'POST',
    body: data,
  });
  console.log(x, 'run');
  return x;
}

export async function getInterviews(params) {
  console.log(params);
  console.log(stringify(params));
  if (params == null) {
    // params = 'test@gmail.com';
    // console.log(JSON.stringify(params));
    return null;
  }
  return request(`${hostedURL}/v1.0/get_interviews/${params}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function createInterview(params) {
  let { prepTime, retakesAllowed, answerTime, interviewName, interviewQuestions, email } = params;
  interviewQuestions = interviewQuestions.map(a => ({
    question: a,
  }));

  const data = {
    interviewName,
    email,
    interview_questions: interviewQuestions,
    interview_config: { retakesAllowed, prepTime, answerTime },
  };

  return request(`${hostedURL}/v1.0/create_interview`, { method: 'POST', body: data });
}

// export  function createInterview(params) {
//   console.log(params)
//   return request(hostedURL + '/v1.0/companies');
// }

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
