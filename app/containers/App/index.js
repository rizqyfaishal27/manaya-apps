import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { push } from 'react-router-redux';
import { isNull, isUndefined } from 'lodash';

import HomePage from 'app/containers/HomePage';
import LoginPage from 'app/containers/LoginPage';
import ContentPage from 'app/containers/ContentPage';
import { store } from 'app';
import { setOnlineStatus } from 'app/globalReducer';


const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  width: 100%;
`;


class App extends Component { 

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(props) {
    console.log(props.online)
    store.dispatch(setOnlineStatus(props.online));
  }

  
  render() {
    return (<AppWrapper>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route path="/content" component={ContentPage} />
      </Switch>
    </AppWrapper>);
  }
}


export default App;


