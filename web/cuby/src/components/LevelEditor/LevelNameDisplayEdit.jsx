import React, { useRef, useEffect } from 'react';
import { getActiveColor, getInactiveColor } from '../../utils/colors';

const LevelNameDisplayEdit = ({
    levelName,
    onLevelNameChange,
    onLevelNameSave,
    isEditing,
    setIsEditing,
    $isInverted,
}) => {
    const inputRef = useRef(null);
    const activeColor = getActiveColor($isInverted);
    const inactiveColor = getInactiveColor($isInverted);

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
        }
    };

    const containerStyle = {
        width: '100%',
        textAlign: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: activeColor,
        background: `${inactiveColor}08`,
        padding: '10px 0',
        letterSpacing: '1px',
        borderBottom: `1px solid ${activeColor}22`,
        cursor: 'pointer',
        minHeight: '40px',
    };

    const inputStyle = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: activeColor,
        background: `${inactiveColor}08`,
        border: `1px solid ${activeColor}99`,
        borderRadius: '4px',
        padding: '2px 8px',
        width: '60%',
        textAlign: 'center',
    };

    return (
        <div
            style={containerStyle}
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
                    style={inputStyle}
                    maxLength={40}
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                levelName?.trim() ? levelName : 'Nivel sin título'
            )}
        </div>
    );
};

export default LevelNameDisplayEdit; 