import { stringify } from 'qs';
import auth0 from 'auth0-js';
import request from '@/utils/request';
import AUTH_CONFIG from '@/Auth/auth0-variables';

// const newApi = 'http://localhost:3000/v1';
const newApi = 'https://a.deephire.com/v1';

// const newApi = 'http://localhost:3001';
// const newApi = 'http://localhost:3000/v1';

const setHeaders = () => ({
  authorization: `Bearer ${localStorage.getItem('access_token')}`,
});

export async function createInterview(params) {
  const {
    prepTime,
    retakesAllowed,
    answerTime,
    interviewName,
    interviewQuestions,
    createdByTeam,
  } = params;
  const questions = interviewQuestions.map(a => ({
    question: a,
  }));

  const body = {
    createdByTeam,
    interviewName,
    interviewQuestions: questions,
    interviewConfig: { retakesAllowed, prepTime, answerTime },
  };

  return request(`${newApi}/interviews`, { method: 'POST', body, headers: setHeaders() });
}

export async function updateInterviews(id, params) {
  const {
    prepTime,
    retakesAllowed,
    answerTime,
    interviewName,
    interviewQuestions,
    createdByTeam,
  } = params;
  const questions = interviewQuestions.map(a => ({
    question: a,
  }));

  const body = {
    interviewName,
    interviewQuestions: questions,
    interviewConfig: { retakesAllowed, prepTime, answerTime },
    createdByTeam,
  };

  return request(`${newApi}/interviews/${id}`, { method: 'PUT', body, headers: setHeaders() });
}

export async function updateCompany(body) {
  return request(`${newApi}/companies`, { method: 'PUT', body, headers: setHeaders() });
}

export async function getShortLists() {
  const shortlists = await request(`${newApi}/shortlists`, {
    method: 'GET',
    headers: setHeaders(),
  });

  if (shortlists) {
    return shortlists.sort((a, b) => (new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1));
  }
  return [];

  // return new Promise(resolve => resolve({ list: shortLists }));
}

// gets data for a specific shortlist, useful for analytics page
export async function getShortListData(id) {
  return request(`${newApi}/shortlists/${id}`, {
    method: 'GET',
    headers: setHeaders(),
  });
  // return new Promise(resolve => resolve(shortListsWithAnalytics));
}

export async function sendEmail(data) {
  return request(`${newApi}/emails`, {
    method: 'POST',
    headers: setHeaders(),
    body: data,
  });
}

export async function createCompany(data) {
  return request(`${newApi}/companies`, {
    method: 'POST',
    headers: setHeaders(),
    body: data,
  });
}

export async function getCompany() {
  return request(`${newApi}/companies`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

// get profile from id
export async function getCandidateProfile(id) {
  return request(`${newApi}/candidates/${id}`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

export async function getRecruiterProfile() {
  return request(`${newApi}/profiles`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

export async function removeCandidateDocument(email, id) {
  return request(`${newApi}/candidates/${email}/documents/${id}`, {
    method: 'DELETE',
    headers: setHeaders(),
  });
}

export async function addComment(liveId, data, successMessage) {
  return request(
    `${newApi}/live/${liveId}/comments`,
    {
      method: 'POST',
      body: data,
      headers: setHeaders(),
    },
    successMessage
  );
}

export async function removeComment(liveId, commentId, successMessage) {
  return request(
    `${newApi}/live/${liveId}/comments/${commentId}`,
    {
      method: 'DELETE',
      headers: setHeaders(),
    },
    successMessage,
    20
  );
}

// take json and create or update
export async function updateCandidateProfile(email, data) {
  const sendData = data;
  delete sendData._id;

  await request(`${newApi}/candidates/${email}`, {
    method: 'PUT',
    headers: setHeaders(),
    body: sendData,
  });

  return request(`${newApi}/candidates/${email}`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

export async function getVideos() {
  // return request(`${hostedURL}/v1.0/get_candidates/${params}`);
  const videos = await request(`${newApi}/videos`, {
    method: 'GET',
    headers: setHeaders(),
  });
  if (videos) {
    return videos.sort((a, b) => (new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1));
  }
  return [];
}
export async function getArchivedVideos() {
  const videos = await request(`${newApi}/videos/archives`, {
    method: 'GET',
    headers: setHeaders(),
  });
  if (videos) {
    return videos.sort((a, b) => (new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1));
  }
  return [];
}

export async function getArchivedInterviews() {
  return request(`${newApi}/interviews/archives`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

export async function getArchivedShortlists() {
  return request(`${newApi}/shortlists/archives`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

export async function arch(data, route, archives = false) {
  const archiveRoute = archives ? 'unarchive' : 'archive';
  return request(`${newApi}/${route}/${archiveRoute}`, {
    method: 'POST',
    body: data,
    headers: setHeaders(),
  });
}

export async function cloneInterview(data) {
  return request(`${newApi}/interviews/duplicate`, {
    method: 'POST',
    body: data,
    headers: setHeaders(),
  });
}

export async function scheduleInterview(data, successMessage) {
  return request(
    `${newApi}/live`,
    {
      method: 'POST',
      body: data,
      headers: setHeaders(),
    },
    successMessage
  );
}

export async function getLiveInterviews() {
  return request(`${newApi}/live`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

export async function getLiveInterview(id) {
  return request(`${newApi}/live/${id}`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

export async function getVideo(id) {
  return request(`${newApi}/videos/${id}`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

export async function getInvoices() {
  const invoices = await request(`${newApi}/companies/invoices`, {
    method: 'GET',
    headers: setHeaders(),
  });
  if (invoices?.data) return invoices.data;
  return [];
}

export async function getSubscriptions() {
  return request(`${newApi}/companies/subscriptions`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

export async function getPaymentMethods() {
  return request(`${newApi}/companies/payment_methods`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

export async function addPaymentMethod(paymentMethodId, successMessage) {
  return request(
    `${newApi}/companies/payment_methods/${paymentMethodId}`,
    {
      method: 'POST',
      headers: setHeaders(),
    },
    successMessage
  );
}

export async function cardWallet() {
  return request(`${newApi}/companies/card_wallet`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

export async function shareShortLink(data) {
  const x = request(`${newApi}/shortlists`, {
    method: 'POST',
    body: data,
    headers: setHeaders(),
  });
  return x;
}

export async function sendInvites(invitedEmail, role, team, successMessage) {
  const data = { invitedEmail, role, team };
  const x = request(
    `${newApi}/companies/invites`,
    {
      method: 'POST',
      body: data,
      headers: setHeaders(),
    },
    successMessage
  );
  return x;
}

export async function deleteInvites(inviteId, successMessage) {
  const x = request(
    `${newApi}/companies/invites/${inviteId}`,
    {
      method: 'DELETE',
      headers: setHeaders(),
    },
    successMessage
  );
  return x;
}

export async function inviteCandidatesToInterview(body, id, successMessage) {
  const x = request(
    `${newApi}/interviews/${id}/invites`,
    {
      method: 'POST',
      headers: setHeaders(),
      body,
    },
    successMessage
  );
  return x;
}

export async function putInvites(inviteId, successMessage) {
  const x = request(
    `${newApi}/companies/invites/${inviteId}`,
    {
      method: 'PUT',
      headers: setHeaders(),
    },
    successMessage
  );
  return x;
}

export async function getInviteById(inviteId) {
  return request(`${newApi}/companies/invites/${inviteId}`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

export async function deleteUsers(auth0UserId, successMessage) {
  const x = request(
    `${newApi}/companies/team/${auth0UserId}`,
    {
      method: 'DELETE',
      headers: setHeaders(),
    },
    successMessage
  );
  return x;
}

export async function getInvites() {
  const x = await request(`${newApi}/companies/invites`, {
    method: 'GET',
    headers: setHeaders(),
  });
  if (x) return x;
  return [];
}

export async function getProduct() {
  const x = request(`${newApi}/companies/product`, {
    method: 'GET',
    headers: setHeaders(),
  });
  return x;
}

export async function getTeam() {
  const x = request(`${newApi}/companies/team`, {
    method: 'GET',
    headers: setHeaders(),
  });
  return x;
}

export async function getInterviews() {
  const interviews = await request(`${newApi}/interviews`, {
    method: 'GET',
    headers: setHeaders(),
  });
  if (interviews) {
    return interviews.sort((a, b) => (new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1));
  }
  return [];
}

export async function resetPassword(email) {
  const webAuth = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
  });

  return new Promise((resolve, reject) => {
    webAuth.changePassword(
      {
        connection: AUTH_CONFIG.dbConnectionName,
        email,
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
  });
}

export async function deleteShortList(params) {
  const { selectedRows } = params;

  await Promise.all(
    selectedRows.map(async value => {
      const { _id } = value;
      const { $oid } = _id;
      const res = await request(`${newApi}/shortlists/${$oid}`, {
        method: 'DELETE',
        headers: setHeaders(),
      });
      return res;
    })
  );
  return getShortLists();
}

export async function removeCandidates(selectedRows, successMessage) {
  // const { selectedRows } = params;

  await Promise.all(
    selectedRows.map(async value => {
      const { _id } = value;
      const res = await request(`${newApi}/videos/${_id}`, {
        method: 'DELETE',
        headers: setHeaders(),
      });
      return res;
    })
  );
  return request(
    `${newApi}/videos`,
    {
      method: 'GET',
      headers: setHeaders(),
    },
    successMessage
  );
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

export async function getEvents() {
  return request(`${newApi}/events`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

export async function getEventbyId(interviewId) {
  return request(`${newApi}/events/${interviewId}`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

export { newApi };
