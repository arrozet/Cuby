import styled from 'styled-components';
import { getInactiveColor, getActiveColor } from '../../utils/colors';

export const UserLevelsContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => getInactiveColor(props.$isInverted)};
  font-family: 'Excalifont';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease;
  /* Responsive padding: top accounts for BackArrow, sides/bottom are flexible */
  padding: clamp(60px, 10vh, 80px) clamp(10px, 3vw, 20px) clamp(20px, 4vh, 30px);
  position: relative;
  overflow-y: auto; /* Allow scrolling if content overflows */
`;

export const Title = styled.h1`
  /* Responsive font size */
  font-size: clamp(2rem, 7vw, 3rem);
  /* Responsive margin */
  margin-bottom: clamp(20px, 5vh, 40px);
  color: ${props => getActiveColor(props.$isInverted)};
  text-align: center;
`;

export const LevelsList = styled.div`
  display: grid;
  /* Responsive columns: min width clamp(250px, 30vw, 300px), max 1fr */
  grid-template-columns: repeat(auto-fill, minmax(clamp(250px, 30vw, 300px), 1fr));
  /* Responsive gap */
  gap: clamp(15px, 3vw, 20px);
  width: 100%;
  max-width: 1200px; /* Max width for the grid */
  overflow-y: auto; /* Should be on container, but keep here if needed */
  /* Responsive padding */
  padding: clamp(10px, 2vw, 20px);
`;

export const LevelCard = styled.div`
  background-color: ${props => getActiveColor(props.$isInverted)}20;
  border: 2px solid ${props => getActiveColor(props.$isInverted)};
  border-radius: 10px;
  /* Responsive padding */
  padding: clamp(15px, 3vw, 20px);
  color: ${props => getActiveColor(props.$isInverted)};
  display: flex; /* Use flex for better internal alignment */
  flex-direction: column; /* Stack content vertically */
  justify-content: space-between; /* Push actions to the bottom */

  h3 {
    /* Responsive font size */
    font-size: clamp(1.2rem, 4vw, 1.5rem);
    /* Responsive margin */
    margin-bottom: clamp(8px, 2vh, 10px);
    word-break: break-word; /* Prevent long names from overflowing */
  }

  p {
    /* Responsive font size */
    font-size: clamp(0.8rem, 2vw, 0.9rem);
    /* Responsive margin */
    margin-bottom: clamp(10px, 2vh, 15px);
    opacity: 0.8;
    flex-grow: 1; /* Allow paragraph to take available space */
  }

  .actions {
    display: flex;
    flex-wrap: wrap; /* Allow buttons to wrap on narrow cards */
    justify-content: space-between; /* Space out buttons */
    gap: clamp(5px, 1vw, 10px); /* Responsive gap between buttons */
    margin-top: auto; /* Ensure actions are at the bottom */

    button {
      background-color: ${props => getActiveColor(props.$isInverted)};
      color: ${props => getInactiveColor(props.$isInverted)};
      border: none;
      border-radius: 5px;
      /* Responsive padding */
      padding: clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 12px);
      cursor: pointer;
      font-family: 'Excalifont';
      /* Responsive font size */
      font-size: clamp(0.8rem, 2vw, 0.9rem);
      transition: opacity 0.2s;
      flex: 1; /* Allow buttons to grow */
      min-width: 60px; /* Minimum width before wrapping */
      margin: 2px 0; /* Add small vertical margin when wrapped */

      &:hover {
        opacity: 0.8;
      }
    }
  }
`;

export const ActionButton = styled.button`
  background-color: ${props => getActiveColor(props.$isInverted)};
  color: ${props => getInactiveColor(props.$isInverted)};
  border: none;
  border-radius: 10px;
  /* Responsive padding */
  padding: clamp(12px, 2vh, 15px) clamp(20px, 4vw, 25px);
  /* Responsive font size */
  font-size: clamp(1.1rem, 3vw, 1.3rem);
  font-family: 'Excalifont';
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
    /* Keep colors the same on hover */
    background-color: ${props => getActiveColor(props.$isInverted)};
    color: ${props => getInactiveColor(props.$isInverted)};
  }
`;

export const ButtonContainer = styled.div`
  /* Responsive margin */
  margin-bottom: clamp(20px, 4vh, 30px);
`;

export const NoLevelsMessage = styled.p`
  /* Responsive font size */
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  color: ${props => getActiveColor(props.$isInverted)};
  text-align: center;
  /* Responsive margin */
  margin-top: clamp(30px, 6vh, 40px);
  /* Responsive padding for text wrapping */
  padding: 0 clamp(15px, 3vw, 20px);
`;