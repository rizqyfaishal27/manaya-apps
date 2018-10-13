import { injectGlobal } from 'styled-components';

injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    margin: 0 auto;
    background-color: #f4f4f4;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    width: 100%;
    background-color: #fff;
    min-height: 100%;
    min-width: 300px;
    overflow-x: hidden;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
`
