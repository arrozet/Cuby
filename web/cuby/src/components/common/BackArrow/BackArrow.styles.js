import styled from 'styled-components';

export const BackArrowContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  
  svg {
    width: 30px;
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