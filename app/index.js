import ReactDOM from 'react-dom';
import React from 'react';
import { Map } from 'immutable';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Online, Offline, Detector } from 'react-detect-offline';
import { BASE_URL } from 'app/request';

import createHashHistory from 'history/createHashHistory';

import "babel-polyfill";
import 'es6-promise/auto';
// import 'react-select/dist/css/react-select.css';


import App from 'app/containers/App';
import configStore from 'app/utils/configStore';

import 'app/globalStyle';

const MOUNT_NODE = document.getElementById('app');
const initialState = new Map();
const history = createHashHistory();
export const store = configStore(initialState, history);


function render() {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history} >
        <Detector polling={{
          timeout: 3000,
          url: BASE_URL + '/ping'
        }} render={({ online }) => (
            <App online={online} />
          )}>
        </Detector>
      </ConnectedRouter>
    </Provider>,
    MOUNT_NODE
  )
}


render();
