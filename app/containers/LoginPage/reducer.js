import { Map, List, fromJS } from 'immutable'; 
import { push } from 'react-router-redux';
import auth from 'app/auth';

import {
  globalReceiveAccountData
} from 'app/globalReducer';

// Reducer Name
const reducerName = 'loginPage';

// Declare Some Variable Here
let someVariable = 'Hello World';

// Initialize Initial State
const initialState = fromJS({
  isLoading: false,
  errors: null
})

// Function to generate action name
const createActionName = (actionName) => `app/${reducerName}/${actionName}`;


// Selectors

// Actions
export const DO_SOMETHING = createActionName('DO_SOMETHING');
export const LOGIN_PAGE_LOGIN_REQUEST = createActionName('LOGIN_PAGE_LOGIN_REQUEST');
export const LOGIN_PAGE_RECEIVE_ACCOUNT_DATA = createActionName('LOGIN_PAGE_RECEIVE_ACCOUNT_DATA');
export const LOGIN_PAGE_RECEIVE_LOGIN_ERRORS = createActionName('LOGIN_PAGE_RECEIVE_LOGIN_ERRORS');


// Actions Creator
export const doSomething = () => ({ type: DO_SOMETHING });
export const loginRequest = () => ({ type: LOGIN_PAGE_LOGIN_REQUEST });
export const receiveAccountData = (data) => ({ type: LOGIN_PAGE_RECEIVE_ACCOUNT_DATA, data });
export const receiveLoginErrors = (errors) => ({ type: LOGIN_PAGE_RECEIVE_LOGIN_ERRORS, errors });

export const loginAction = ({ email, password }) => {
  return dispatch => {
    dispatch(loginRequest());
    return auth.login(email, password)
      .then(response => {
        if(response.status == 200){
          const token = response.data.token;
          window.localStorage.setItem('auth-token', token);
          dispatch(receiveAccountData(response.data));
          dispatch(globalReceiveAccountData(response.data));
          dispatch(push('/content/create'));
        }
      })
      .catch(error => {
        if(error.response.status == 400) {
          dispatch(receiveLoginErrors(error.response.data));
        }
      })
  }
}


// Reducer
export default function reducer(state=initialState, action) {
  switch(action.type) {
    case LOGIN_PAGE_LOGIN_REQUEST:
      return state.set('isLoading', true);
    case LOGIN_PAGE_RECEIVE_ACCOUNT_DATA:
      return state.set('isLoading', false);
    case LOGIN_PAGE_RECEIVE_LOGIN_ERRORS:
      return state.set('isLoading', false)
                  .set('errors', action.errors.error);
    default:
      return state;
  }
}
