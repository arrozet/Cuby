import React from 'react';
import {
    ZoomControls,
    ZoomButton,
} from './LevelEditor.styles';
import { FaHandPaper } from 'react-icons/fa';
import { getActiveColor, getInactiveColor } from '../../utils/colors';

const CanvasZoomControls = ({
    onZoomIn,
    onZoomOut,
    onTogglePanMode,
    isPanModeActive,
    $isInverted,
}) => {
    const activeColor = getActiveColor($isInverted);
    const inactiveColor = getInactiveColor($isInverted);

    return (
        <ZoomControls>
            <ZoomButton
                onClick={(e) => { e.stopPropagation(); onZoomIn(); }}
                $isInverted={$isInverted}
                $isActive={false}
                title="Acercar (+)"
            >
                +
            </ZoomButton>
            <ZoomButton
                onClick={(e) => { e.stopPropagation(); onZoomOut(); }}
                $isInverted={$isInverted}
                $isActive={false}
                title="Alejar (-)"
            >
                -
            </ZoomButton>
            <ZoomButton
                onClick={(e) => { e.stopPropagation(); onTogglePanMode(); }}
                $isInverted={$isInverted}
                $isActive={isPanModeActive}
                title="Mover Vista (Espacio)"
            >
                <FaHandPaper />
            </ZoomButton>
        </ZoomControls>
    );
};

export default CanvasZoomControls; 