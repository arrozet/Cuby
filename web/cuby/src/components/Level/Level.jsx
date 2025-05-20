import React from 'react';
import { LevelContainer } from './Level.styles';
import { useInversion } from '../../context/InversionContext';

import PlatformDisplay from '../GameElements/PlatformDisplay';
import SpikeDisplay from '../GameElements/SpikeDisplay';
import TrampolineDisplay from '../GameElements/TrampolineDisplay';
import PortalDisplay from '../GameElements/PortalDisplay';
import GoalDisplay from '../GameElements/GoalDisplay';

const Level = ({ width, height, level }) => {
  const { isInverted } = useInversion();

  if (!level || !level.platforms) {
    return <LevelContainer width={width} height={height} $isInverted={isInverted}><div>Cargando...</div></LevelContainer>;
  }

  return (
    <LevelContainer width={width} height={height} $isInverted={isInverted}>
      {level.platforms.map((platform, index) => (
        <PlatformDisplay key={`platform-${index}`} {...platform} $isInverted={isInverted} />
      ))}
      {level.obstacles?.map((obstacle, index) => ( // Aún es buena idea el ?.
        <SpikeDisplay key={`obstacle-${index}`} {...obstacle} $isInverted={isInverted} />
      ))}
      {level.trampolines?.map((trampoline, index) => (
        <TrampolineDisplay key={`trampoline-${index}`} {...trampoline} $isInverted={isInverted} />
      ))}
      {level.portals?.map((portal, index) => (
        <PortalDisplay key={`portal-${index}`} {...portal} $isInverted={isInverted} />
      ))}
      {level.goal && (
        <GoalDisplay {...level.goal} $isInverted={isInverted} />
      )}
    </LevelContainer>
  );
};

export default Level;