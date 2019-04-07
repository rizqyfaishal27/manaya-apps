import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import thunk from 'redux-thunk';
import { routerMiddleware, routerReducer } from 'react-router-redux';

import globalReducer from 'app/globalReducer';

import loginPageReducer from 'app/containers/LoginPage/reducer';
import createTransactionPageReducer from 'app/containers/CreateTransactionPage/reducer';
import contentPageReducer from 'app/containers/ContentPage/reducer';
import transactionRecordsPageReducer from 'app/containers/TransactionRecordsPage/reducer';




export default function configStore(initialState, history) {
  const middlewares = [
    thunk,
    routerMiddleware(history),
  ];

  const reducers = combineReducers({
    routing: routerReducer,
    global: globalReducer,
    loginPage: loginPageReducer,
    createTransactionPage: createTransactionPageReducer,
    contentPage: contentPageReducer,
    transactionRecordsPage: transactionRecordsPageReducer
  });


  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // TODO Try to remove when `react-router-redux` is out of beta, LOCATION_CHANGE should not be fired more than once after hot reloading
        // Prevent recomputing reducers for `replaceReducer`
        shouldHotReload: false,
      })
      : compose;
  /* eslint-enable */

  const store = createStore(
    reducers,
    initialState,
    composeEnhancers(...enhancers)
  );

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createReducer(store.injectedReducers));
    });
  }

  return store;
}
