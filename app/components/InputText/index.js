import React from 'react';
import styled from 'styled-components';

const InputTextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: stretch;
  align-items: center;
  margin: 1.5rem 0;
  & > input {
    width: 100%;
    padding: 0.5rem 0;
    text-align: center;
    color: ${props => props.color};
    border: none;
    border-bottom: 2px solid ${props => props.borderColor};
    outline: none;
    &:focus {
      border-color: ${props => props.borderColorFocus};
    }
    transition: border-color 0.3s ease-in;
    border-radius: 3px;
    &:disabled {
      background-color: #ddd;
    }
  }

`;

const InputText = (props) => {
  return (
    <InputTextWrapper 
      color={props.color} 
      borderColor={props.borderColor} 
      borderColorFocus={props.borderColorFocus}>
      <input placeholder={props.placeholder} type={props.type} 
        onChange={props.onChange}
        defaultValue={props.defaultValue}
        ref={props.inputRef} disabled={props.disabled}/>
    </InputTextWrapper>
  )
} 


export default InputText;
