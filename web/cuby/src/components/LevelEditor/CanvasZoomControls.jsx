import React from 'react';
import {
    ZoomControls, // Reutilizamos el styled-component
    ZoomButton,   // Reutilizamos el styled-component
} from './LevelEditor.styles';
import { FaHandPaper } from 'react-icons/fa';

const CanvasZoomControls = ({
    onZoomIn,
    onZoomOut,
    onTogglePanMode,
    isPanModeActive,
    isInverted,
}) => {
    return (
        <ZoomControls>
            <ZoomButton
                onClick={(e) => { e.stopPropagation(); onZoomIn(); }}
                isInverted={isInverted}
                title="Acercar (+)"
            >
                +
            </ZoomButton>
            <ZoomButton
                onClick={(e) => { e.stopPropagation(); onZoomOut(); }}
                isInverted={isInverted}
                title="Alejar (-)"
            >
                -
            </ZoomButton>
            <ZoomButton
                onClick={(e) => { e.stopPropagation(); onTogglePanMode(); }}
                isInverted={isInverted}
                isActive={isPanModeActive}
                title="Mover Vista (Espacio)"
            >
                <FaHandPaper />
            </ZoomButton>
        </ZoomControls>
    );
};

export default CanvasZoomControls; 