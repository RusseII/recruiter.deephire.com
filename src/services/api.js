import { stringify } from 'qs';
import request from '@/utils/request';

const hostedURL = 'https://api.deephire.com';
const newApi = 'https://a.deephire.com';

// const hostedURL = 'http://localhost:3001';
// const newApi = 'http://localhost:3000';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function sendEmail(data) {
  console.log(data);
  return request(`${newApi}/v1/emails`, {
    method: 'POST',
    body: data,
  });
}

// get profile from id
export async function getCandidateProfile(id) {
  return request(`${newApi}/v1/candidates/${id}`);
}

// take json and create or update
export async function updateCandidateProfile(data) {
  console.log(data);
  delete data._id;

  return request(`${newApi}/v1/candidates`, { method: 'PUT', body: data });
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

export async function removeInterview(params) {
  const { email, selectedRows } = params;
  await Promise.all(
    selectedRows.map(async value => {
      const { _id } = value;
      const { $oid } = _id;
      const res = await request(`${newApi}/v1/interviews/${$oid}`, {
        method: 'DELETE',
      });
      return res;
    })
  );
  return request(`${hostedURL}/v1.0/get_interviews/${email}`);
}

export async function removeCandidate(params) {
  const { email, selectedRows } = params;
  await Promise.all(
    selectedRows.map(async value => {
      const { user_id, company_id } = value;
      const res = await request(`${newApi}/v1/candidates/${user_id}/${company_id}`, {
        method: 'DELETE',
      });
      return res;
    })
  );
  console.log(email, 'EAMIL HERE');
  return request(`${hostedURL}/v1.0/get_candidates/${email}`);
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
