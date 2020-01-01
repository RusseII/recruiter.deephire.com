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
  const { prepTime, retakesAllowed, answerTime, interviewName, interviewQuestions } = params;
  const questions = interviewQuestions.map(a => ({
    question: a,
  }));

  const body = {
    interviewName,
    interviewQuestions: questions,
    interviewConfig: { retakesAllowed, prepTime, answerTime },
  };

  return request(`${newApi}/interviews`, { method: 'POST', body, headers: setHeaders() });
}

export async function updateInterviews(id, params) {
  const { prepTime, retakesAllowed, answerTime, interviewName, interviewQuestions } = params;
  const questions = interviewQuestions.map(a => ({
    question: a,
  }));

  const body = {
    interviewName,
    interviewQuestions: questions,
    interviewConfig: { retakesAllowed, prepTime, answerTime },
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

export async function removeCandidateDocument(email, id) {
  return request(`${newApi}/candidates/${email}/documents/${id}`, {
    method: 'DELETE',
    headers: setHeaders(),
  });
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
  const videos = request(`${newApi}/videos`, {
    method: 'GET',
    headers: setHeaders(),
  });
  videos.then(r => r.sort((a, b) => (new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1)));
  return videos;
}
export async function getArchivedVideos() {
  const videos = request(`${newApi}/videos/archives`, {
    method: 'GET',
    headers: setHeaders(),
  });
  videos.then(r => r.sort((a, b) => (new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1)));
  return videos;
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

export async function getVideo(id) {
  return request(`${newApi}/videos/${id}`, {
    method: 'GET',
    headers: setHeaders(),
  });
}

export async function getInvoices() {
  return Promise.resolve({
    object: 'list',
    url: '/v1/invoices',
    has_more: false,
    data: [
      {
        id: 'in_1F9pkqGOtDCPpPqjjlGBqwDv',
        object: 'invoice',
        account_country: 'US',
        account_name: 'DeepHire',
        amount_due: 19900,
        amount_paid: 19900,
        amount_remaining: 0,
        application_fee_amount: null,
        attempt_count: 1,
        attempted: true,
        auto_advance: false,
        billing_reason: 'subscription_create',
        charge: 'ch_1F9pkrGOtDCPpPqjqUNenu33',
        collection_method: 'charge_automatically',
        created: 1566378320,
        currency: 'usd',
        custom_fields: null,
        customer: 'cus_FfA5LQlRugBfDV',
        customer_address: null,
        customer_email: 'rus@gmail.com',
        customer_name: null,
        customer_phone: null,
        customer_shipping: null,
        customer_tax_exempt: 'none',
        customer_tax_ids: [],
        default_payment_method: null,
        default_source: null,
        default_tax_rates: [],
        description: null,
        discount: null,
        due_date: null,
        ending_balance: 0,
        footer: null,
        hosted_invoice_url: 'https://pay.stripe.com/invoice/invst_Ic3cZiZILUzITe0JZBUftz9hiR',
        invoice_pdf: 'https://pay.stripe.com/invoice/invst_Ic3cZiZILUzITe0JZBUftz9hiR/pdf',
        lines: {
          data: [
            {
              id: 'il_tmp_78fdbec9b43c08',
              object: 'line_item',
              amount: 19900,
              currency: 'usd',
              description: '1 × basic DH (at $199.00 / month)',
              discountable: true,
              livemode: false,
              metadata: {},
              period: {
                end: 1582275920,
                start: 1579597520,
              },
              plan: {
                id: 'plan_FfA2JJC2axxLnH',
                object: 'plan',
                active: true,
                aggregate_usage: null,
                amount: 19900,
                amount_decimal: '19900',
                billing_scheme: 'per_unit',
                created: 1566378173,
                currency: 'usd',
                interval: 'month',
                interval_count: 1,
                livemode: false,
                metadata: {},
                nickname: 'Monthly',
                product: 'prod_FfA2YYfOeVAkmL',
                tiers: null,
                tiers_mode: null,
                transform_usage: null,
                trial_period_days: null,
                usage_type: 'licensed',
              },
              proration: false,
              quantity: 1,
              subscription: 'sub_FfA5npznub8vxc',
              subscription_item: 'si_FfA5O55gzQpOn2',
              tax_amounts: [],
              tax_rates: [],
              type: 'subscription',
            },
          ],
          has_more: false,
          object: 'list',
          url: '/v1/invoices/in_1F9pkqGOtDCPpPqjjlGBqwDv/lines',
        },
        livemode: false,
        metadata: {},
        next_payment_attempt: null,
        number: 'EF26895D-0001',
        paid: true,
        payment_intent: 'pi_1F9pkqGOtDCPpPqjjtZmDP7Q',
        period_end: 1566378320,
        period_start: 1566378320,
        post_payment_credit_notes_amount: 0,
        pre_payment_credit_notes_amount: 0,
        receipt_number: null,
        starting_balance: 0,
        statement_descriptor: null,
        status: 'paid',
        status_transitions: {
          finalized_at: 1566378320,
          marked_uncollectible_at: null,
          paid_at: 1566378321,
          voided_at: null,
        },
        subscription: 'sub_FfA5npznub8vxc',
        subtotal: 19900,
        tax: null,
        tax_percent: null,
        total: 19900,
        total_tax_amounts: [],
        webhooks_delivered_at: 1566378322,
      },
    ],
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

export async function sendInvites(invitedEmail, role, successMessage) {
  const data = { invitedEmail, role };
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
  const x = request(`${newApi}/companies/invites`, {
    method: 'GET',
    headers: setHeaders(),
  });
  return x;
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

export async function removeCandidate(params) {
  const { selectedRows } = params;

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
  return request(`${newApi}/videos`, {
    method: 'GET',
    headers: setHeaders(),
  });
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

export { newApi };
