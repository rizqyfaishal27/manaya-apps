import React from 'react';
import styled from 'styled-components';

const CircleButton = styled.button`
  padding: 0;
  margin: 0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  border: none;
  outline: none;
  font-weight: bolder;
  &:active {
    background-color: ${props => props.backgroundColorActive};
  }
  &:disabled {
    background-color: ${props => props.backgroundColorDisabled};
  }
`;

export default CircleButton;
