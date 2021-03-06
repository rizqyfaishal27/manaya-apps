import { Map, List, fromJS } from 'immutable'; 
import { isNull } from 'lodash';
import { push } from 'react-router-redux';
import moment from 'moment';
import { DB } from 'app/utils/configLocalDB';

import {
  getTransaskiBaru,
  postTransaksiBaru
} from 'app/api';

// Reducer Name
const reducerName = 'createTransactionPage';

// Declare Some Variable Here
let someVariable = 'Hello World';
export const CREATE_TRANSACTION_MODE = 1;
export const SUMMARY_TRANSACTION_MODE = 2;
export const CHECKOUT_TRANSACTION_MODE = 3;
export const FINISH_TRANSACTION_MODE = 4;
export const SUCCESS_TRANSACTION_MODE = 5;

// Initialize Initial State
const initialState = fromJS({
  mode: CREATE_TRANSACTION_MODE,
  isLoading: false,
  transactionData: null,
  currentCategory: { value: -1, label: '' },
  jumlah_bayar: -1,
  isResetField: false,
});

// Function to generate action name
const createActionName = (actionName) => `app/${reducerName}/${actionName}`;

// Reducer
export default function reducer(state=initialState, action) {
  switch(action.type) {
    case CREATE_TRANSACTION_RESET_FIELD:
      return state.set('isResetField', false)
                  .set('mode', CREATE_TRANSACTION_MODE);
    case CREATE_TRANSACTION_POST_TRANSACTION_REQUEST:
      return state.set('isLoading', true);
    case CREATE_TRANSACTION_RECEIVE_SUCCESS_TRANSACTION:
      const transactionData = state.get('transactionData').toJS();
      console.log(transactionData);
      return initialState.set('isLoading', false)
                         .set('mode', SUCCESS_TRANSACTION_MODE)
                         .set('isResetField', true)
                         .set('transactionData', state.get('transactionData'))
                         .set('currentCategory', transactionData.kategori_wisatawan.length > 0 ? 
                          { value:  transactionData.kategori_wisatawan[0], 
                            label:  transactionData.kategori_wisatawan[0].nama_kategori[0].toUpperCase() +
                              transactionData.kategori_wisatawan[0].nama_kategori.substr(1) } : null);
    case CREATE_TRANSACTION_SET_JUMLAH_BAYAR:
      return state.set('jumlah_bayar', action.value);
    case CREATE_TRANSACTION_CONTINUE_TO_FINISH:
      return state.set('mode', FINISH_TRANSACTION_MODE);
    case CREATE_TRANSACTION_ON_CORRECTION:
      const currMode = state.get('mode');
      if(currMode == CHECKOUT_TRANSACTION_MODE) {
        return state.set('mode', SUMMARY_TRANSACTION_MODE);
      } 
      return state.set('mode', CREATE_TRANSACTION_MODE);
    case CREATE_TRANSACTION_CONTINUE_TO_CHECK_OUT:
      return state.set('mode', CHECKOUT_TRANSACTION_MODE);
    case CREATE_TRANSACTION_CONTINUE_TO_SUMMARY:
      return state.set('mode', SUMMARY_TRANSACTION_MODE);
    case CREATE_TRANSACTION_SET_CATEGORY:
      const currentCategory = state.get('currentCategory');
      return state.set('currentCategory', action.value);
    case CREATE_TRANSACTION_FETCH_INITIAL_DATA:
      return state.set('isLoading', true);
    case CREATE_TRANSACTION_RECEIVE_INITIAL_DATA: {
      return state.set('isLoading', false)
                  .set('transactionData', 
                    fromJS(action.data)
                      .updateIn(['tiket'], 
                        tiket => tiket.map(tiketItem => tiketItem.set('jumlah', 0)))
                      .updateIn(['kategori_wisatawan'], kategori => 
                        kategori.map((kat, index) => 
                          index == 0 ?  kat.set('active', true) : kat.set('active', false)))
                      .set('provinsi', '')
                      .set('kabupaten', '')
                      .set('negara', '')
                  )
                  .set('currentCategory', action.data.kategori_wisatawan.length > 0 ? 
                    { value:  action.data.kategori_wisatawan[0], 
                      label:  action.data.kategori_wisatawan[0].nama_kategori[0].toUpperCase() +
                        action.data.kategori_wisatawan[0].nama_kategori.substr(1) } : null);
    }
    case CREATE_TRANSACTION_INCREASE_AMOUNT_TICKET:
      let max = state.getIn(['transactionData', 'tiket', action.index, 'jumlah_tiket']);
      if(isNull(max)) {
        return state.updateIn(['transactionData', 'tiket', action.index, 'jumlah'], 
          jumlah => jumlah + 1);
      }
      return state.updateIn(['transactionData', 'tiket', action.index, 'jumlah'], 
          jumlah => jumlah < max ? jumlah + 1 : max);
    case CREATE_TRANSACTION_DECREASE_AMOUNT_TICKET:
      return state.updateIn(['transactionData', 'tiket', action.index, 'jumlah'], 
          jumlah => jumlah >= 1 ? jumlah - 1 : 0);
    default:
      return state;
  }
}

// Selectors

// Actions
export const DO_SOMETHING = createActionName('DO_SOMETHING');
export const CREATE_TRANSACTION_FETCH_INITIAL_DATA = createActionName('CREATE_TRANSACTION_FETCH_INITIAL_DATA');
export const CREATE_TRANSACTION_RECEIVE_INITIAL_DATA = createActionName('CREATE_TRANSACTION_RECEIVE_INITIAL_DATA');
export const CREATE_TRANSACTION_INCREASE_AMOUNT_TICKET = createActionName('CREATE_TRANSACTION_INCREASE_AMOUNT_TICKET');
export const CREATE_TRANSACTION_DECREASE_AMOUNT_TICKET = createActionName('CREATE_TRANSACTION_DECREASE_AMOUNT_TICKET');
export const CREATE_TRANSACTION_SET_CATEGORY = createActionName('CREATE_TRANSACTION_SET_CATEGORY');

export const CREATE_TRANSACTION_CONTINUE_TO_SUMMARY = createActionName('CREATE_TRANSACTION_CONTINUE_TO_SUMMARY');
export const CREATE_TRANSACTION_CONTINUE_TO_CHECK_OUT = createActionName('CREATE_TRANSACTION_CONTINUE_TO_CHECK_OUT');
export const CREATE_TRANSACTION_CONTINUE_TO_FINISH = createActionName('CREATE_TRANSACTION_CONTINUE_TO_FINISH');
export const CREATE_TRANSACTION_ON_CORRECTION = createActionName('CREATE_TRANSACTION_ON_CORRECTION');

export const CREATE_TRANSACTION_SET_JUMLAH_BAYAR = createActionName('CREATE_TRANSACTION_SET_JUMLAH_BAYAR');

export const CREATE_TRANSACTION_POST_TRANSACTION_REQUEST = createActionName('CREATE_TRANSACTION_POST_TRANSACTION_REQUEST');
export const CREATE_TRANSACTION_RECEIVE_SUCCESS_TRANSACTION = createActionName('CREATE_TRANSACTION_RECEIVE_SUCCESS_TRANSACTION');

export const CREATE_TRANSACTION_RESET_FIELD = createActionName('CREATE_TRANSACTION_RESET_FIELD');

// Actions Creator
export const doSomething = () => ({ type: DO_SOMETHING });
export const fetchInitialData = () => ({ type: CREATE_TRANSACTION_FETCH_INITIAL_DATA });
export const receiveInitialData = (data) => ({ type: CREATE_TRANSACTION_RECEIVE_INITIAL_DATA, data });

export const increaseAmountTicket = (index) => ({ type: CREATE_TRANSACTION_INCREASE_AMOUNT_TICKET, index});
export const decreaseAmountTicket = (index) => ({ type: CREATE_TRANSACTION_DECREASE_AMOUNT_TICKET, index});

export const setCategory = (value) => ({ type: CREATE_TRANSACTION_SET_CATEGORY, value });
export const continueToSummary = () => ({ type: CREATE_TRANSACTION_CONTINUE_TO_SUMMARY });
export const continueToCheckout = () => ({ type: CREATE_TRANSACTION_CONTINUE_TO_CHECK_OUT });
export const continueToFinish = () => ({ type: CREATE_TRANSACTION_CONTINUE_TO_FINISH });
export const correction = () => ({ type: CREATE_TRANSACTION_ON_CORRECTION });
export const setJumlahBayar = (value) => ({ type: CREATE_TRANSACTION_SET_JUMLAH_BAYAR, value})

export const postTransactionRequest = () => ({ type: CREATE_TRANSACTION_POST_TRANSACTION_REQUEST });
export const receiveSuccessTransaction = (data) => ({ type: CREATE_TRANSACTION_RECEIVE_SUCCESS_TRANSACTION, data });

export const resetField = () => ({ type: CREATE_TRANSACTION_RESET_FIELD });

export const postTransaction = (requestData, online) => {
  return dispatch => {
    dispatch(postTransactionRequest());
    if(online) {
      return postTransaksiBaru([requestData])
        .then(response => {
          if(response.status == 200) {
            DB.put({
              requestData,
              _id: moment.now().toString(),
              is_synced: true,
              created_at: moment.now()
            })
            .then(success => {
              dispatch(fetchInitialDataAction(!online));
              dispatch(receiveSuccessTransaction(response.data));
            })
            .catch(error => {
              console.log(error);
            })
          }
        })
        .catch(error => {
          console.log(error);
        })
      } else {
        DB.put({
          requestData,
          is_synced: false,
          _id: moment.now().toString(),
          created_at: moment.now()
        })
        .then(success => {
          dispatch(fetchInitialDataAction(!online));
          dispatch(receiveSuccessTransaction(requestData));
        })
        .catch(error => console.log(error))
      }
  }
}
 
export const fetchInitialDataAction = (offline) => {
  return dispatch => {
    const transactionDataDate = window.localStorage.getItem('transactionDataDate');
    const momentObj = moment.unix(+transactionDataDate / 1000);
    if(moment().diff(momentObj, 'days') >= 1 && !offline) {

      dispatch(fetchInitialData());
      return getTransaskiBaru()
        .then(response => {
          if(response.status == 200) {
            dispatch(receiveInitialData(response.data));
            const localstorage = window.localStorage;
            localstorage.setItem('transactionData', JSON.stringify(response.data));
            localstorage.setItem('transactionDataDate', JSON.stringify(moment.now()));
          }
        })
        .catch(error => {
          if(error.response.status == 401) {
            dispatch(push('/'));
          }
        })
    } else {
      const transactionData = window.localStorage.getItem('transactionData');
      dispatch(receiveInitialData(JSON.parse(transactionData)));
    }
    
  }
}
