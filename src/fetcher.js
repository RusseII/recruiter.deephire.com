const root = 'https://a.deephire.com';
// const root = 'http://localhost:3000';

const setHeaders = () => ({
  authorization: `Bearer ${localStorage.getItem('access_token')}`,
});

const fetcher = async url => {
  const res = await fetch(`${root}${url}`, { method: 'GET', headers: setHeaders() });

  if (!res.ok) {
    throw new Error('Error status code');
  }
  return res.json();
};

export default fetcher;
