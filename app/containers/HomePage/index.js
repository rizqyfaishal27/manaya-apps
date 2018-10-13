import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Bg from 'app/containers/HomePage/bg.png';
import Title from 'app/containers/HomePage/title.png';
import Logo from 'app/containers/HomePage/logo.png';
import Wallet from 'app/containers/HomePage/wallet.svg';
import Coin from 'app/containers/HomePage/coin.svg';
import Card from 'app/containers/HomePage/card.svg';

const HomePageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: center;
  height: 100vh;
  & > div.additional-icons {
    width: 50%;
    padding: 2rem;
    display: flex;
    height: 300px;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    & > div {
      margin-top: -2rem;
    }
    & > div > img {
      width: 70px;
    }
    & > div:nth-child(1) {
      align-self: flex-start;
    }

    & > div:nth-child(3) {
      align-self: center;
    }
  }
  & > div.company-logo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 2rem;
    & > img {
      &:first-child {
        width: 70%;
      }

      &:last-child {
        width: 30%;
        margin-top: -1rem;
        margin-left: -7rem;
      }
    }
  }

  & > div.bottom-bg {
    overflow-y: hidden;
    height: 300px;
    bottom: 0;
    position: absolute;
    width: 100%;
    & > img {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 300px;
    }
  } 
`;

class HomePage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (<HomePageWrapper>
      <div className="company-logo">
        <img src={Logo} alt="logo" />
        <img src={Title} alt="title" />
      </div>
      <div className="additional-icons">
        <div>
          <img alt="dompet" src={Wallet} /> 
        </div>
        <div>
          <img alt="Coin" src={Coin} />
        </div>
        <div>
          <img alt="Card" src={Card} />
        </div>
      </div>
      <div className="bottom-bg">
        <img src={Bg} alt="bg" />
      </div>
    </HomePageWrapper>)
  }
}


const mapStateToProps = (state) => ({
  global: state.get('global').toJS()
});

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
