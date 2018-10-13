import React from 'react';
import styled from 'styled-components';

const TextContent  = styled.div`
  width: 100%;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  border-radius: 25px;
  padding: 0.8rem;
  text-weight: bolder;
  box-sizing: border-box;
  & > h1, & > h2, & > h3, & > h4, & > h5, & > h6 {
    margin: 0;
  }
`;

export default TextContent;
