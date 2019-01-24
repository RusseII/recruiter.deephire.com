import request from '@/utils/request';
import Auth from '../Auth/Auth';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  const auth = new Auth();
  return new Promise((resolve, reject) => {
    auth.getProfile((err, profile) => {
      if (!err) return resolve(profile);
      return reject(err);
    });
  });
}
