import * as request from 'app/request';

const storage = window.localStorage;
const auth = {
  login: (email , password) => request.genericRequest(`/login`, 'POST', { email, password }),
  verify: (token) => request.genericRequest('/verify_token', 'POST', { token })
}

export default auth;
