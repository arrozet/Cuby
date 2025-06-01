import React, { useState, useEffect } from 'react';
import { PlayerContainer, Eye, ExplosionParticle, ExplosionContainer } from './Player.styles';
import { useInversion } from '../../context/InversionContext';

/**
 * Componente Player - Representa al personaje principal del juego
 * 
 * Este componente es responsable de renderizar el cubo que representa
 * al jugador. El cubo cambia de color según el estado de inversión
 * del juego.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {number} props.x - Posición horizontal del jugador
 * @param {number} props.y - Posición vertical del jugador
 * @param {number} props.size - Tamaño del cubo del jugador (ancho y alto)
 * @param {Function} props.onDeath - Función que se llama cuando el jugador muere
 */
const Player = ({ x, y, size, onDeath }) => {
  const { isInverted } = useInversion();
  const [explosion, setExplosion] = useState(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (onDeath) {
      // Crear el efecto de explosión en la posición de muerte
      const handleDeath = (deathX, deathY) => {
        setExplosion({ x: deathX, y: deathY });
        
        // Generar partículas de explosión
        const newParticles = [];
        const numParticles = 12;
        const baseSpeed = 50;

        for (let i = 0; i < numParticles; i++) {
          const angle = (i / numParticles) * Math.PI * 2;
          const speed = baseSpeed * (0.5 + Math.random() * 0.5);
          const tx = Math.cos(angle) * speed;
          const ty = Math.sin(angle) * speed;
          newParticles.push({ tx, ty });
        }
        setParticles(newParticles);

        // Limpiar la explosión después de la animación
        setTimeout(() => {
          setExplosion(null);
          setParticles([]);
        }, 500);
      };

      // Registrar el manejador de muerte
      onDeath(handleDeath);
    }
  }, [onDeath]);

  return (
    <>
      <PlayerContainer
        x={x}
        y={y}
        size={size}
        $isInverted={isInverted}
      >
        <Eye $isInverted={isInverted} />
        <Eye $isInverted={isInverted} />
      </PlayerContainer>
      {explosion && (
        <ExplosionContainer
          x={explosion.x}
          y={explosion.y}
          size={size}
          $isInverted={isInverted}
        >
          {particles.map((particle, index) => (
            <ExplosionParticle
              key={index}
              tx={particle.tx}
              ty={particle.ty}
              $isInverted={isInverted}
            />
          ))}
        </ExplosionContainer>
      )}
    </>
  );
};

export default Player;