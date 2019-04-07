import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import auth from 'app/auth';

// Reducer Name
const reducerName = 'global';

// Declare Some Variable Here
let someVariable = 'Hello World';

// Intial State
const initialState = fromJS({
  location: null,
  data: 'ping',
  userData: null,
  isLoggedIn: false,
  isVerifiyingToken: false,
  online: true
})

export default function reducer(state=initialState, action) {
  switch(action.type) {
    case PONG:
      return state.set('data', 'pong');
    case GLOBAL_RECEIVE_ACCOUNT_DATA:
      return state.set('userData', action.data)
                  .set('isLoggedIn', true);
    case GLOBAL_VERIFY_TOKEN:
      return state.set('isVerifiyingToken', true);
    case GLOBAL_ON_VERIFY_TOKEN_OK:
      return state.set('isVerifiyingToken', false)
                  .set('isLoggedIn', true);
    case GLOBAL_ON_VERIFY_TOKEN_UNAUTHORIZED:
      return state.set('isVerifiyingToken', false);
    case LOCATION_CHANGE: 
      return state.merge({
        location: action.payload
      })
    case GLOBAL_ON_SET_ONLINE_STATUS:
      return state.set('online', action.online);
    default:
      return state;
  }
}


const createActionName = (actionName) => `app/${reducerName}/${actionName}`

// Selectors

// Actions
export const DO_SOMETHING = createActionName('DO_SOMETHING');
export const PING = createActionName('PING');
export const PONG = createActionName('PONG');

export const GLOBAL_RECEIVE_ACCOUNT_DATA = createActionName('GLOBAL_RECEIVE_ACCOUNT_DATA');
export const GLOBAL_VERIFY_TOKEN = createActionName('GLOBAL_VERIFY_TOKEN');
export const GLOBAL_ON_VERIFY_TOKEN_OK = createActionName('GLOBAL_ON_VERIFY_TOKEN_OK');
export const GLOBAL_ON_VERIFY_TOKEN_UNAUTHORIZED = createActionName('GLOBAL_ON_VERIFY_TOKEN_UNAUTHORIZED');
export const GLOBAL_ON_SET_ONLINE_STATUS = createActionName('GLOBAL_ON_SET_ONLINE_STATUS');

// Actions Creator
export const doSomething = () => ({ type: DO_SOMETHING });
export const globalReceiveAccountData = (data) => ({ type: GLOBAL_RECEIVE_ACCOUNT_DATA, data });
export const verifyTokenRequest = () => ({ type: GLOBAL_VERIFY_TOKEN });
export const verifyTokenOk = (token) => ({ type: GLOBAL_ON_VERIFY_TOKEN_OK, token });
export const verifyTokenUnauthorized = () => ({ type: GLOBAL_ON_VERIFY_TOKEN_UNAUTHORIZED });

export const verifyToken = (token) => {
  return dispatch => { 
    dispatch(verifyTokenRequest());
    return auth.verify(token)
      .then(response => {
        if(response.status == 200) {
          dispatch(verifyTokenOk(response.data));
          dispatch(push('/content/create'))
        }
      })
      .catch(error => {
        if(error.response.status == 401 || error.response.status == 500) {
          dispatch(push('/'));
          dispatch(verifyTokenUnauthorized());
        }
      })
  }
}

export const setOnlineStatus = (online) => ({ type: GLOBAL_ON_SET_ONLINE_STATUS, online });

