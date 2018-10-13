import React from 'react';
import styled from 'styled-components';

import LogoWhite from 'app/components/NavigationBar/logo_white.png';
import NavIcon from 'app/components/NavigationBar/nav_icon.png';

const NavigationBarWrapper = styled.div`
  top: 0;
  position: fixed;
  display: flex;
  padding: 0.5rem 0;
  justify-content: stretch;
  align-items: center;
  width: 100%;
  bx-sizing: border-box;
  background-color: #00BBFF;
  height: 35px;
  z-index: 101;
  & > div {
    width: 100%;
    padding: 0.5rem 1.5rem;
    display: flex;
    align-items: center;
    & > div:nth-child(1) {
      width: 50%;
    }

    & > div:nth-child(2) {
      width: 50%;
      display: flex;
      justify-content: flex-end;
    }
  }
`;

const NavigationBar = (props) => {
  return (
    <NavigationBarWrapper>
      <div>
        <div>
          { !props.isActive && <img src={NavIcon} alt="nav-icon" height="20" onClick={props.onNavClick}/> }
        </div>
        <div>
          <img src={LogoWhite} alt="company-logo" height="60" />
        </div>
      </div>
    </NavigationBarWrapper>
  )
}

export default NavigationBar;
