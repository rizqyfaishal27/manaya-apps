import React from 'react';
import styled from 'styled-components';
import Tick from 'app/components/CheckBox/tick.svg';

const CheckBoxWrapper = styled.div`
  & > input[type="checkbox"] {
    display: none;
    &:checked + div.box {
      & > img {
        display: block;
      }
    }
  }
  & > div.box {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: 1px solid #aaa;
    position: relative;
    & > img {
      position: absolute;
      display: none;

    }
  }
`;


const CheckBox = (props) => {
  return (
    <CheckBoxWrapper>
      <input type="checkbox" id={props.id} ref={props.inputRef} />
      <div className="box">
        <img src={Tick} alt="tick" width="20" />
      </div>
    </CheckBoxWrapper>
  )
}

export default CheckBox;
