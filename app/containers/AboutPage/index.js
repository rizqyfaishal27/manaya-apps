import React, { Component } from 'react';
import styled from 'styled-components';

import Bg from 'app/containers/LoginPage/bg.png';

const AboutPageWrapper = styled.div`
  padding-top: 2rem;
  box-sizing: border-box;
  position: relative;

  & > div.title-about {
    padding: 0.5rem 1.7rem 0 1.7rem;
    & > h2 {
      font-size: 1.75rem;
      color: #aaa;
    }
  }

  & > div.about-content {
    margin: 1rem;
    background-color: #00bbff;
    color: #fff;
    padding: 1rem 1.5rem;
    & > h3 {
      color: #0006ffcf;
      border-bottom: 2px solid #0006ff;
      padding: 0.75rem 0.25rem;
      margin: 0;
    }

    & > p {
      line-height: 1.3remx;
    }
  }
`;

class AboutPage extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (
      <AboutPageWrapper>
        <div className="title-about">
          <h2>Tentang Manaya</h2>
        </div>
        <div className="about-content">
          <h3>Manaya Ticketing Solution</h3>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type 
            specimen book. It has survived not only five centuries, but also the leap into 
            electronic typesetting, remaining essentially unchanged. 
          </p>
          <p>
            It was popularised in
            the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
            and more recently with desktop publishing software like Aldus PageMaker including 
            versions of Lorem Ipsum
          </p>
        </div>
      </AboutPageWrapper>
    )
  }
}


export default AboutPage;
