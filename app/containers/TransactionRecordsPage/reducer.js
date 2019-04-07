import { Map, List, fromJS } from 'immutable'; 
import { DB } from 'app/utils/configLocalDB';
import { postTransaksiBaru } from 'app/api';
import moment from 'moment';
// Reducer Name
const reducerName = 'transactionRecordsPage';

// Declare Some Variable Here
let someVariable = 'Hello World';

// Initialize Initial State
const initialState = fromJS({
  isSync: false,
  selectedDate: null,
  currentRecords: null,
  totalNumberUnsync: -1
})

// Function to generate action name
const createActionName = (actionName) => `app/${reducerName}/${actionName}`;

// Reducer
export default function reducer(state=initialState, action) {
  switch(action.type) {
    case TRANSACTION_RECORDS_PAGE_ON_SYNC_TO_SERVER_START:
      return state.set('isSync', true);
    case TRANSACTION_RECORDS_PAGE_ON_SYNC_TO_SERVER_END:
      return state.set('isSync', false);
    case TRANSACTION_RECORDS_PAGE_ON_RECEIVE_DATA_FROM_LOCAL_DB:
      return state.set('currentRecords',  action.data).set('totalNumberUnsync', action.totalNumberUnsync);
    default:
      return state;
  }
}

// Selectors

// Actions
export const DO_SOMETHING = createActionName('DO_SOMETHING');
export const TRANSACTION_RECORDS_PAGE_FETCH_DATA_FROM_LOCAL_DB = createActionName('TRANSACTION_RECORDS_PAGE_FETCH_DATA_FROM_LOCAL_DB');
export const TRANSACTION_RECORDS_PAGE_ON_SELECT_DATE = createActionName('TRANSACTION_RECORDS_PAGE_ON_SELECT_DATE');
export const TRANSACTION_RECORDS_PAGE_ON_RECEIVE_DATA_FROM_LOCAL_DB = createActionName('TRANSACTION_RECORDS_PAGE_ON_RECEIVE_DATA_FROM_LOCAL_DB');
export const TRANSACTION_RECORDS_PAGE_ON_SYNC_TO_SERVER_START = createActionName('TRANSACTION_RECORDS_PAGE_ON_SYNC_TO_SERVER_START');
export const TRANSACTION_RECORDS_PAGE_ON_SYNC_TO_SERVER_END = createActionName('TRANSACTION_RECORDS_PAGE_ON_SYNC_TO_SERVER_END');

// Actions Creator
export const doSomething = () => ({ type: DO_SOMETHING });
export const syncToServerStart = () => ({ type: TRANSACTION_RECORDS_PAGE_ON_SYNC_TO_SERVER_START });
export const syncToServerEnd = () => ({ type: TRANSACTION_RECORDS_PAGE_ON_SYNC_TO_SERVER_END });

export const fetchTransactionRecordsFromLocalDB = () => ({
  type: TRANSACTION_RECORDS_PAGE_FETCH_DATA_FROM_LOCAL_DB,
});

export const receiveDataFromLocalDB = (data, totalNumberUnsync) => ({
  type: TRANSACTION_RECORDS_PAGE_ON_RECEIVE_DATA_FROM_LOCAL_DB,
  data,
  totalNumberUnsync
});

export const onSelectDate = (value) => ({
  value,
  type: TRANSACTION_RECORDS_PAGE_ON_SELECT_DATE
});

export const syncToServer = () => {
  return dispatch => {
    dispatch(syncToServerStart());
    return DB.find({
      selector: {
        is_synced: false
      },
      fields: ['_id', 'requestData', '_rev', 'created_at'],
      sort: ['_id']
    })
    .then(results => {
      const docs = results.docs;
      if(docs.length > 0) {
        return postTransaksiBaru(
            docs.map(doc => doc.requestData)
          )
          .then(response => {
            if(response.status == 200) {
              DB.bulkDocs(docs.map(doc => ({
                _id: doc._id,
                _rev: doc._rev,
                requestData: doc.requestData,
                created_at: doc.created_at,
                is_synced: true
              })))
              .then(results => {
                if(results) {
                  window.localStorage.setItem('lastSyncedDate', moment.now());
                  dispatch(fetchTransactionRecordsFromLocalDBAction());
                  dispatch(syncToServerEnd());
                }
              })
            }
          })
      }
    }) 
    .catch(error => console.log(error));
  }
}

export const fetchTransactionRecordsFromLocalDBAction = (date) => {
  return dispatch => {
    dispatch(onSelectDate(date));
    dispatch(fetchTransactionRecordsFromLocalDB());
    const ltDate = moment(date).add(1, 'day').valueOf();
    return DB.find({
      selector: {
        created_at: {
          $gte: date,
          $lt: ltDate
        },
      },
      fields: ['_id', 'requestData', 'is_synced', 'created_at'],
      sort: ['_id']
    })
    .then(results => {
      const totalNumberUnsync = results.docs.filter(doc => !doc.is_synced)
        .reduce((acc, curr) => acc + 1, 0);
      console.log(totalNumberUnsync);
      dispatch(receiveDataFromLocalDB(results.docs, totalNumberUnsync));
    })
    .catch(error => console.log(error));
  }
}
