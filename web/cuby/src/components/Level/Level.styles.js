import styled from 'styled-components';

export const LevelContainer = styled.div`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: ${props => props.isInverted ? 'black' : 'white'};
  transition: background-color 0.3s;
  overflow: hidden;
`;

export const Platform = styled.div`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  /* Cambiado para que solo se rendericen elementos del mismo color que el fondo */
  background-color: ${props => 
    props.color === (props.isInverted ? 'white' : 'black') ?
      (props.isInverted ? 'white' : 'black') : 'transparent'
  };
  /* Si es transparente, no mostrar borde */
  border: ${props => 
    props.color === (props.isInverted ? 'white' : 'black') ?
    '1px solid #333' : 'none'
  };
  transition: background-color 0.3s;
  /* No rendericemos en absoluto los elementos inactivos */
  display: ${props => 
    props.color === (props.isInverted ? 'white' : 'black') ?
    'block' : 'none'
  };
`;

export const Obstacle = styled.div`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: ${props => 
    props.color === (props.isInverted ? 'white' : 'black') ?
      (props.isInverted ? 'white' : 'black') : 'transparent'
  };
  /* No rendericemos en absoluto los elementos inactivos */
  display: ${props => 
    props.color === (props.isInverted ? 'white' : 'black') ?
    'block' : 'none'
  };
  
  &:before {
    content: '';
    position: absolute;
    top: -10px;
    left: 0;
    width: 0;
    height: 0;
    border-left: ${props => props.width / 2}px solid transparent;
    border-right: ${props => props.width / 2}px solid transparent;
    border-bottom: 10px solid ${props => 
      props.color === (props.isInverted ? 'white' : 'black') ?
        (props.isInverted ? 'white' : 'black') : 'transparent'
    };
  }
`;

export const Trampoline = styled.div`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: ${props => 
    props.color === (props.isInverted ? 'white' : 'black') ?
      (props.isInverted ? 'white' : 'black') : 'transparent'
  };
  border-bottom: 5px solid ${props => 
    props.color === (props.isInverted ? 'white' : 'black') ?
      (props.isInverted ? 'white' : 'black') : 'transparent'
  };
  border-radius: 50% 50% 0 0;
  /* No rendericemos en absoluto los elementos inactivos */
  display: ${props => 
    props.color === (props.isInverted ? 'white' : 'black') ?
    'block' : 'none'
  };
`;

export const Goal = styled.div`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  border: 3px dashed ${props => props.isInverted ? 'white' : 'black'};
  border-radius: 50%;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;