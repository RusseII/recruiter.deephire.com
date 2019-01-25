import { stringify } from 'qs';
import request from '@/utils/request';

const hostedURL = 'https://api.deephire.com';
const newApi = 'https://a.deephire.com';

// const hostedURL = 'http://localhost:3001';
// const newApi = 'http://localhost:3000';

const setHeaders = () => ({
  authorization: `Bearer ${localStorage.getItem('access_token')}`,
});

export async function createInterview(params) {
  const { prepTime, retakesAllowed, answerTime, interviewName, interviewQuestions, email } = params;
  const questions = interviewQuestions.map(a => ({
    question: a,
  }));

  const data = {
    interviewName,
    email,
    interview_questions: questions,
    interview_config: { retakesAllowed, prepTime, answerTime },
  };

  return request(`${hostedURL}/v1.0/create_interview`, { method: 'POST', body: data });
}

export async function sendEmail(data) {
  return request(`${newApi}/v1/emails`, {
    method: 'POST',
    headers: setHeaders(),
    body: data,
  });
}

// get profile from id
export async function getCandidateProfile(id) {
  return request(`${newApi}/v1/candidates/${id}`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

// take json and create or update
export async function updateCandidateProfile(data) {
  const sendData = data;
  delete sendData._id;

  return request(`${newApi}/v1/candidates`, {
    method: 'PUT',
    headers: setHeaders(),
    body: sendData,
  });
}

export async function queryRule2(params) {
  if (params == null) {
    // params = 'test@gmail.com';
    return null;
  }
  return request(`${hostedURL}/v1.0/get_candidates/${params}`);
}

export async function shareShortLink(data) {
  const x = request(`${hostedURL}/v1.0/create_shortlist`, {
    method: 'POST',
    body: data,
  });
  return x;
}

export async function getInterviews(params) {
  if (params == null) {
    // params = 'test@gmail.com';
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
        headers: setHeaders(),
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
      const { user_id: userId, company_id: companyId } = value;
      const res = await request(`${newApi}/v1/candidates/${userId}/${companyId}`, {
        method: 'DELETE',
        headers: setHeaders(),
      });
      return res;
    })
  );
  return request(`${hostedURL}/v1.0/get_candidates/${email}`);
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
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

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}
