import { newApi, hostedURL } from './api';

describe('Auth Variables Test', () => {
  it('API should be hitting the production node apis', () => {
    expect(newApi).toEqual('https://a.deephire.com/v1');
    expect(hostedURL).toEqual('https://api.deephire.com');
  });
});
