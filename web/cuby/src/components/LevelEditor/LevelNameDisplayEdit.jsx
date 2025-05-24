import React, { useRef, useEffect } from 'react';
import { getActiveColor } from '../../utils/colors';

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
        display: 'inline-block',
        maxWidth: '40%',
        textAlign: 'left',
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: activeColor,
        background: 'transparent',
        padding: '10px',
        letterSpacing: '1px',
        cursor: 'pointer',
        minHeight: '40px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
        marginLeft: '80px',
    };

    const inputStyle = {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: activeColor,
        background: 'transparent',
        border: `1px solid ${activeColor}99`,
        borderRadius: '4px',
        padding: '2px 8px',
        width: '100%',
    };

    return (
        <h1
            style={containerStyle}
            onClick={() => !isEditing && setIsEditing(true)}
            title={
                levelName && levelName.length > 20 ? levelName : undefined
            }
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
                <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {levelName?.trim() ? levelName : 'Nivel sin título'}
                </span>
            )}
        </h1>
    );
};

export default LevelNameDisplayEdit; 