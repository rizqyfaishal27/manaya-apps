import React from 'react';
import styled from 'styled-components';

import Close from 'app/components/NavigationContent/close.png';

const NavigationContentWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  position: fixed;
  top: 35px;
  height: calc(100vh - 35px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  display: ${props => !props.isActive ? 'none' : 'flex'};
  opacity: ${props => props.isActive ? 1 : 0};
  transition: opacity ease-in-out 0.7s;
  background-color: #fff;
  z-index: 100;
  & > div {
    max-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    & > h1 {
      color: #00BBFF;
    }
    & > div.nav-list {
      margin: 2rem 0;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: space-around;
      & > a {
        border-bottom: 2px solid #00BBFF;
        text-align: center;
        margin: 0.5rem 0;
        font-size: 1.5rem;
        color: #aaa;
      }
    }

    & > div:last-child {
      & > button {
        background-color: #fff;
        outline: none;
        border: none;
      }
    }
  }
`;

const NavigationContent = (props) => {
  return (
    <NavigationContentWrapper isActive={props.isActive}>
      <div>
        <h1>Menu</h1>
        <div className="nav-list">
          { props.menus.map(menu => 
            <a key={menu.text} onClick={menu.onClick}>{menu.text}</a>
          )}
        </div>
        <div>
          <button onClick={props.onCloseClick}>
            <img src={Close} alt="close-x" width="30" />
          </button>
        </div>
      </div>
    </NavigationContentWrapper>
  )
}


export default NavigationContent;
