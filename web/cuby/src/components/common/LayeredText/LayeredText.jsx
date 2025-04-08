import React from 'react';
import { LayeredTextContainer, TextLayer } from './LayeredText.styles';

const LayeredText = ({ 
  text,
  fontSize = '120px',
  fontWeight = '400',
  letterSpacing = '2px',
  offset = 4,
  isInverted = false,
  backColor = '#343A40',
  middleColor = 'white',
  frontColor = '#343A40',
  marginBottom = '30px'
}) => {
  return (
    <LayeredTextContainer marginBottom={marginBottom}>
      <TextLayer 
        className="back"
        fontSize={fontSize}
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
        isInverted={isInverted}
        offset={offset}
        backColor={backColor}
        middleColor={middleColor}
        frontColor={frontColor}
      >
        {text}
      </TextLayer>
      <TextLayer 
        className="middle"
        fontSize={fontSize}
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
        isInverted={isInverted}
        offset={offset}
        backColor={backColor}
        middleColor={middleColor}
        frontColor={frontColor}
        style={{ userSelect: 'text' }}
      >
        {text}
      </TextLayer>
      <TextLayer 
        className="front"
        fontSize={fontSize}
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
        isInverted={isInverted}
        backColor={backColor}
        middleColor={middleColor}
        frontColor={frontColor}
      >
        {text}
      </TextLayer>
    </LayeredTextContainer>
  );
};

export default LayeredText;