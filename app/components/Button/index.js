import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  margin: 1rem;
  text-align: center;
  color: ${props => props.color};
  background-color: ${props => props.backgroundColor};
  outline: none;
  border: 1px solid ${props => props.borderColor};
  border-radius: 5px;
  padding: 1rem;
  &:active {
    background-color: ${props => props.backgroundColorActive};
  }
  &:disabled {
    background-color: ${props => props.backgroundColorDisabled};
  }
`;

Button.propTypes = {
  
}

export default Button;
