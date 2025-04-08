import { createGlobalStyle } from 'styled-components';
import Excalifont from './fonts/Excalifont-Regular.woff2';

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Excalifont';
    src: url(${Excalifont}) format('woff2');
    font-weight: normal;
    font-style: normal;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body, #root {
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  body {
    font-family: 'Excalifont', 'Arial';
    background-color: black;
  }
  
  canvas {
    display: block;
    width: 100vw !important;
    height: 100vh !important;
  }
  
  button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: black;
    color: white;
    border: 2px solid white;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background-color: white;
      color: black;
    }
  }
`;