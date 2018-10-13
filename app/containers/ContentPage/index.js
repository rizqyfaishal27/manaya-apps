import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { push } from 'react-router-redux';
import { isNull, isUndefined } from 'lodash';

import CreateTransactionPage from 'app/containers/CreateTransactionPage';
import AboutPage from 'app/containers/AboutPage';

import NavigationBar from 'app/components/NavigationBar';
import NavigationContent from 'app/components/NavigationContent';

import {
  onNavigationTap,
  onNavigationMenuTapAction,
  onLogoutAction
} from 'app/containers/ContentPage/reducer';

import {
  verifyToken 
} from 'app/globalReducer';



import Bg from 'app/containers/LoginPage/bg.png';


const ContentPageWrapper = styled.div`
  & > div.bottom-bg {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    background: url(${Bg}) no-repeat center;
    background-size: cover;
    background-position: center top;
    height: 80px;
    z-index: 1;
  }

  & > div.content {
    z-index: 11;
    min-height: calc(100vh - (80px));
  }

  & > div.loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
`;



class ContentPage extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, global } = this.props;
    const token = window.localStorage.getItem('auth-token');  
    if(!global.isLoggedIn) {
      if(!isNull(token) && !isUndefined(token)) {
        dispatch(verifyToken(token));
      } else {
        dispatch(push('/'));
      }
    }
  }

  render() {
    const { dispatch, contentPage } = this.props;
    const menus = [
      {
        text: 'Transaksi baru',
        onClick: (e) => {
          e.preventDefault();
          dispatch(onNavigationMenuTapAction(`${this.props.match.url}/create`));
        }
      },
      {
        text: 'Tentang Manaya',
        onClick: (e) => {
          e.preventDefault();
          dispatch(onNavigationMenuTapAction(`${this.props.match.url}/about`))
        }
      },
      {
        text: 'Logout',
        onClick: (e) => {
          e.preventDefault();
          dispatch(onLogoutAction('/'));
        }
      }
    ]
    return ( 
      global.isVerifiyingToken ?
      <ContentPageWrapper>
        <div className="loader">
          <img src={Loader} alt="loader-icon" witdh="80" />
        </div>
      </ContentPageWrapper> :
      <ContentPageWrapper>
        <NavigationBar 
          onNavClick={() => {dispatch(onNavigationTap()) }} 
          isActive={contentPage.navIsActive} />
        <NavigationContent 
          menus={menus} 
          isActive={contentPage.navIsActive}
          onCloseClick={() => { dispatch(onNavigationTap())}}/> 
        <div className="content">
          <Route path={`${this.props.match.url}/create`} component={CreateTransactionPage} />
          <Route path={`${this.props.match.url}/about`} component={AboutPage} />
        </div>
        <div className="bottom-bg"></div>
      </ContentPageWrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  contentPage: state.get('contentPage').toJS(),
  global: state.get('global').toJS()
})

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(ContentPage);
