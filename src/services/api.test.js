import { newApi } from './api';

describe('Auth Variables Test', () => {
  it('API should be hitting the production node apis', () => {
    expect(newApi).toEqual('https://a.deephire.com/v1');
  });
});
