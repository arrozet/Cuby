import styled from 'styled-components';

export const BackArrowContainer = styled.div`
   position: absolute; 
   top: 7px; 
   left: 30px; 
  cursor: pointer;
  z-index: 10;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 50px;
    height: auto;
  }
  
   .arrow-icon {
    path:nth-child(2) {
      d: path('M1.5 4H12.5H4');
    }
    
    path {
      transition: 0.25s ease;
    }
  }
  
  &:hover {
    .arrow-icon {
      path:nth-child(1) {
        d: path('M1 4H12V4');
      }
      
      path:nth-child(2) {
        d: path('M1.5 4H12.5H16');
        transform: translateX(-4px);
      }
      
      path:nth-child(3) {
        transform: translateX(-4px);
      }
    }
  }
`;