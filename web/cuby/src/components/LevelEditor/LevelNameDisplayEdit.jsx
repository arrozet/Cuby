import React, { useRef, useEffect } from 'react';
import { getActiveColor } from '../../utils/colors'; // Asumiendo que esta ruta es correcta

const LevelNameDisplayEdit = ({
    levelName,
    onLevelNameChange,
    onLevelNameSave,
    isEditing,
    setIsEditing,
    isInverted,
}) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleBlur = () => {
        setIsEditing(false);
        onLevelNameSave();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            onLevelNameSave();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            // Podrías querer revertir el nombre aquí si onLevelNameChange no lo hace inmediatamente
            // o si quieres que Escape cancele los cambios no guardados en el input.
            // Por ahora, solo cerramos el input.
        }
    };

    const activeColor = getActiveColor(isInverted);

    return (
        <div
            style={{
                width: '100%',
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: activeColor,
                background: 'rgba(0,0,0,0.04)',
                padding: '10px 0',
                letterSpacing: '1px',
                borderBottom: `1px solid ${activeColor}22`,
                cursor: 'pointer',
                minHeight: '40px', // Asegura altura consistente
            }}
            onClick={() => !isEditing && setIsEditing(true)}
        >
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={levelName}
                    onChange={onLevelNameChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: activeColor,
                        background: 'rgba(0,0,0,0.04)',
                        border: `1px solid ${activeColor}99`,
                        borderRadius: '4px',
                        padding: '2px 8px',
                        width: '60%',
                        textAlign: 'center',
                    }}
                    maxLength={40}
                    onClick={(e) => e.stopPropagation()} // Evita que el div padre maneje el click
                />
            ) : (
                levelName?.trim() ? levelName : 'Untitled Level'
            )}
        </div>
    );
};

export default LevelNameDisplayEdit; 