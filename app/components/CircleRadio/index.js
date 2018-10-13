import React from 'react';
import styled from 'styled-components';

const CircleRadioWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  & > input {
    opacity: 0;
    position: absolute;
    z-index: 12;
    width: 32px;
    height: 32px;

    &:checked + div.circle {
      & > div.inner-circle {
        display: block;
      }
    }
  }

  & > div.circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid #111dbb;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    & > div.inner-circle {
      background-color: #111dbb;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: none;
      position: absolute;
      display: none;
    }
  }

`;

const CircleRadio = (props) => {
  return (
    <CircleRadioWrapper>
      <input type="radio" 
        value={props.value} 
        name={props.name} 
        defaultChecked={props.defaultChecked} />
      <div className="circle">  
        <div className="inner-circle"></div>
      </div>
    </CircleRadioWrapper>
  )
}

export default CircleRadio;
