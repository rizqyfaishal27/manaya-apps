import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isNull, isUndefined } from 'lodash';
import { push } from 'react-router-redux';

import {
  verifyToken 
} from 'app/globalReducer';


import Button from 'app/components/Button';
import InputText from 'app/components/InputText';
import InputLabel from 'app/components/InputLabel';
import CheckBox from 'app/components/CheckBox';

import LogoWhite from 'app/containers/LoginPage/logo_white.png';
import Bg from 'app/containers/LoginPage/bg.png';
import Loader from 'app/containers/LoginPage/loader.svg';
import LogoColor from 'app/containers/HomePage/logo.png';

import {
  loginAction
} from 'app/containers/LoginPage/reducer';

const LoginPageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: stretch;
  position: relative;
  & > div.top-logo {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    background: url(${Bg}) no-repeat center;
    background-size: cover;
    background-position: center top;
    height: 130px;
    transform: rotate(180deg);

    & > img {
      margin-top: 4rem;
      height: 70px;
      transform: rotate(180deg);
    }
  }

  & > div.login-form {
    width: 250px;
    min-height: calc(100vh - 250px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & > div.login-title {
      & > h1, & > h4 {
        color: #ccc;
        text-align: center;
      }
    }

    & > div.form-field {
      & > div.remember {
        display: flex;
        align-items: center;
        justify-content: center;
        & > div {
          margin: 0 0.5rem;
        }

        & + div {
          display: flex;
          align-items: stretch;
          justify-content: stretch;
          flex-direction: column;
        }
      }

      & > div:last-child {
        & > p.errorMessage {
          color: red;
          text-align: center;
        }
      }

    }
  }



  & > div.bottom-bg {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    background: url(${Bg}) no-repeat center;
    background-size: cover;
    background-position: center top;
    height: 120px;
  }

  & > div.loader {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

class LoginPage extends Component {


  constructor(props) {
    super(props);
    this.rememberMeRef = React.createRef();
    this.emailRef = React.createRef();
    this.passwordRef = React.createRef();

    this.onLoginButtonClick = this.onLoginButtonClick.bind(this);
  }

  onLoginButtonClick() {
    const { dispatch } = this.props;
    const requestData = {
      email: this.emailRef.current.value,
      password: this.passwordRef.current.value,
    };
    dispatch(loginAction(requestData));
  }

  componentDidMount() {
    const { dispatch, global } = this.props;
    const token = window.localStorage.getItem('auth-token');  
    if(!isNull(token) && !isUndefined(token)) {
      dispatch(verifyToken(token));
    }
  }

  render() {
    const { loginPage, global } = this.props;
    return (
      global.isVerifiyingToken ? 
      <LoginPageWrapper>
        <div className="loader">
          <img src={LogoColor} alt="logo" width="120" />
          <img src={Loader} alt="loading-icon" width="80"/>
        </div>
      </LoginPageWrapper>
      :
      <LoginPageWrapper>
        <div className="top-logo">
          <img src={LogoWhite} alt="logo-white" />
        </div>
        <div className="login-form">
          <div className="login-title">
            <h1>
              Manaya Admin Login
            </h1>
            <h4>Ticketing Solution</h4>
          </div>
          <div className="form-field">
            <InputText 
              disabled={loginPage.isLoading}
              color="#333"
              inputRef={this.emailRef} 
              placeholder="Email"
              type="text"
              borderColor="#ddd" borderColorFocus="#aaa" />
            <InputText 
              disabled={loginPage.isLoading}
              color="#333"
              inputRef={this.passwordRef} 
              placeholder="Password"
              type="password"
              borderColor="#ddd" borderColorFocus="#aaa" />
            <div className="remember"></div>
            <div>
              { !isNull( loginPage.errors ) &&
                <p className="errorMessage">{ loginPage.errors }</p>
              }
              <Button
                disabled={loginPage.isLoading}
                onClick={this.onLoginButtonClick}
                color="#fff" 
                backgroundColor="#00BBFF" 
                backgroundColorDisabled="#008ec2"
                backgroundColorActive="#008EC2">
                { loginPage.isLoading ?
                  <img src={Loader} height="30" alt="loader-icon"/> : 'Login'
                }
              </Button>
            </div>
          </div>
        </div>
        <div className="bottom-bg"></div>
      </LoginPageWrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  global: state.get('global').toJS(),
  loginPage: state.get('loginPage').toJS(),
})

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
