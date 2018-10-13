import React from 'react';
import styled from 'styled-components';


const MediumRoundedButton = styled.button`
  border-radius: 12px;
  background-color: ${props => props.backgroundColor};
  width: ${props => props.width};
  height: ${props => props.height};
  color: ${props => props.color};
  padding: 1rem;
  text-align: center;
  border: none;
  outline: none;
  z-index: 100;
  &:active {
    background-color: ${props => props.backgroundColorActive};
  }
  &:disabled {
    background-color: ${props => props.backgroundColorDisabled};
  }
`;

export default MediumRoundedButton;
