import React from 'react';
import { LayeredTextContainer, TextLayer } from './LayeredText.styles';

const LayeredText = ({ 
  text,
  fontSize = '120px',
  fontWeight = '400',
  letterSpacing = '2px',
  offset = 4,
  isInverted = false,
  backDefaultColor = '#343A40',
  middleDefaultColor = 'white',
  frontDefaultColor = '#343A40',
  backInversedColor = '#e7ebda',
  middleInversedColor = 'black',
  frontInversedColor = '#e7ebda',
  marginBottom = '30px'
}) => {
  return (
    <LayeredTextContainer $marginBottom={marginBottom}>
      <TextLayer 
        className="back"
        fontSize={fontSize}
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
        $isInverted={isInverted}
        offset={offset}
        $backDefaultColor={backDefaultColor}
        $backInversedColor={backInversedColor}
      >
        {text}
      </TextLayer>
      <TextLayer 
        className="middle"
        fontSize={fontSize}
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
        $isInverted={isInverted}
        offset={offset}
        $middleDefaultColor={middleDefaultColor}
        $middleInversedColor={middleInversedColor}
        style={{ userSelect: 'text' }}
      >
        {text}
      </TextLayer>
      <TextLayer 
        className="front"
        fontSize={fontSize}
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
        $isInverted={isInverted}
        $frontDefaultColor={frontDefaultColor}
        $frontInversedColor={frontInversedColor}
      >
        {text}
      </TextLayer>
    </LayeredTextContainer>
  );
};

export default LayeredText;