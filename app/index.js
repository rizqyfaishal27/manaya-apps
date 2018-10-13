import ReactDOM from 'react-dom';
import React from 'react';
import { Map } from 'immutable';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHashHistory from 'history/createHashHistory';

import "babel-polyfill";
import 'es6-promise/auto';

import App from 'app/containers/App';
import configStore from 'app/utils/configStore';

import 'app/globalStyle';

const MOUNT_NODE = document.getElementById('app');
const initialState = new Map();
const history = createHashHistory();
const store = configStore(initialState, history);


function render() {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history} >
        <App />
      </ConnectedRouter>
    </Provider>,
    MOUNT_NODE
  )
}


render();
