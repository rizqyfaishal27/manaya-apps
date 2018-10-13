import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { push } from 'react-router-redux';
import { isNull, isUndefined } from 'lodash';

import HomePage from 'app/containers/HomePage';
import LoginPage from 'app/containers/LoginPage';
import ContentPage from 'app/containers/ContentPage';



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


