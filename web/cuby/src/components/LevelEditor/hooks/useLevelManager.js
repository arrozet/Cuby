import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserLevelById, saveUserLevel, createEmptyLevel } from '../../../utils/levelManager';
import { LevelEncoder } from '../../../utils/levelEncoder';
import { Platform, Spike, Trampoline, Portal, Goal } from '../../GameElements/GameElements';

const LOGICAL_LEVEL_WIDTH = 1200;
const LOGICAL_LEVEL_HEIGHT = 800;

/**
 * Hook personalizado para gestionar la carga, guardado, importación y exportación de niveles.
 * @param {string} levelIdParam - ID del nivel a cargar, o 'new' para un nivel nuevo.
 * @returns {object} Objeto con el estado del nivel y las funciones para gestionarlo.
 * @returns {object|null} object.level - El objeto del nivel actual, o null si no está cargado.
 * @returns {Function} object.setLevel - Función para actualizar el estado del nivel.
 * @returns {string} object.levelName - Nombre actual del nivel.
 * @returns {Function} object.setLevelName - Función para actualizar el nombre del nivel.
 * @returns {boolean} object.hasUnsavedChanges - Indica si hay cambios sin guardar.
 * @returns {Function} object.setHasUnsavedChanges - Función para actualizar el estado de cambios sin guardar.
 * @returns {boolean} object.saveDialogOpen - Indica si el diálogo de guardar está abierto.
 * @returns {Function} object.setSaveDialogOpen - Función para abrir/cerrar el diálogo de guardar.
 * @returns {boolean} object.importDialogOpen - Indica si el diálogo de importación está abierto.
 * @returns {Function} object.setImportDialogOpen - Función para abrir/cerrar el diálogo de importación.
 * @returns {number} object.portalCounter - Contador para asignar IDs únicos a los portales.
 * @returns {Function} object.setPortalCounter - Función para actualizar el contador de portales.
 * @returns {Function} object.handleSave - Manejador para iniciar el proceso de guardado del nivel.
 * @returns {Function} object.handleSaveConfirm - Manejador para confirmar y guardar el nivel (usado por el diálogo).
 * @returns {Function} object.handleExport - Manejador para exportar el nivel a un código.
 * @returns {Function} object.handleImport - Manejador para importar un nivel desde un código.
 */
export const useLevelManager = (levelIdParam) => {
    const navigate = useNavigate();
    const [level, setLevel] = useState(null);
    const [levelName, setLevelName] = useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [importSuccessDialogOpen, setImportSuccessDialogOpen] = useState(false);
    const [exportedCode, setExportedCode] = useState('');
    const [portalCounter, setPortalCounter] = useState(1);

    /**
     * Efecto para cargar los datos del nivel cuando el ID del nivel cambia.
     * Si el ID es 'new', crea un nivel vacío.
     * Si el ID es inválido, redirige a la lista de niveles del usuario.
     */
    useEffect(() => {
        let levelData;
        if (levelIdParam === 'new') {
            levelData = createEmptyLevel();
        } else {
            levelData = getUserLevelById(levelIdParam);
        }

        if (levelData) {
            const reconstructedLevel = {
                ...levelData,
                platforms: (levelData.platforms || []).map(p => p instanceof Platform ? p : new Platform(p)),
                obstacles: (levelData.obstacles || []).map(o => o instanceof Spike ? o : new Spike(o)),
                trampolines: (levelData.trampolines || []).map(t => t instanceof Trampoline ? t : new Trampoline(t)),
                portals: (levelData.portals || []).map(p => p instanceof Portal ? p : new Portal(p)),
                goal: levelData.goal instanceof Goal ? levelData.goal : new Goal(levelData.goal || { x: LOGICAL_LEVEL_WIDTH - 100, y: LOGICAL_LEVEL_HEIGHT - 100 })
            };
            setLevel(reconstructedLevel);
            setHasUnsavedChanges(false);
            setLevelName(reconstructedLevel.name || '');
            const maxPortalId = Math.max(0, ...(reconstructedLevel.portals || []).map(p => p.portalId || 0));
            setPortalCounter(maxPortalId + 1);
        } else if (levelIdParam !== 'new') {
            console.error(`Nivel con ID ${levelIdParam} no encontrado.`);
            navigate('/user-levels');
        }
    }, [levelIdParam, navigate]);

    /**
     * Maneja el guardado del nivel.
     * Si el nombre del nivel no está definido o es el predeterminado, abre el diálogo de guardado.
     * De lo contrario, guarda directamente el nivel.
     */
    const handleSave = useCallback(() => {
        if (!level) return;
        const effectiveName = levelName.trim() || level.name;
        if (!effectiveName || effectiveName === 'Untitled Level') {
            setLevelName(effectiveName === 'Untitled Level' ? '' : effectiveName || '');
            setSaveDialogOpen(true);
            return;
        }
        const levelToSave = { ...level, name: effectiveName };
        const savedLevelId = saveUserLevel(levelToSave, levelIdParam === 'new' ? null : levelIdParam);
        if (savedLevelId) {
            setHasUnsavedChanges(false);
            setLevel(levelToSave); // Update level state with saved version (e.g., if name changed)
            if (levelIdParam === 'new') {
                navigate(`/level-editor/${savedLevelId}`, { replace: true });
            }
        } else {
            alert("Error al guardar el nivel existente.");
        }
    }, [level, levelIdParam, levelName, navigate, setLevel, setHasUnsavedChanges, setSaveDialogOpen]);

    /**
     * Confirma y guarda el nivel desde el diálogo de guardado.
     * Requiere un nombre de nivel válido.
     */
    const handleSaveConfirm = useCallback(() => {
        if (!level || !levelName.trim()) {
            alert("Por favor, introduce un nombre válido para el nivel.");
            return;
        }
        const levelToSave = { ...level, name: levelName.trim() };
        const idToSaveUnder = levelIdParam === 'new' ? null : levelIdParam;
        const savedLevelId = saveUserLevel(levelToSave, idToSaveUnder);

        if (savedLevelId) {
            setSaveDialogOpen(false);
            setHasUnsavedChanges(false);
            setLevel(levelToSave); // Ensure local state is updated
            if (levelIdParam === 'new') {
                navigate(`/level-editor/${savedLevelId}`, { replace: true });
            }
        } else {
            alert("Error al guardar el nivel.");
        }
    }, [level, levelName, levelIdParam, navigate, setLevel, setHasUnsavedChanges, setSaveDialogOpen]);    /**
     * Exporta el nivel actual a un formato de código.
     * El código se copia al portapapeles y se muestra en un diálogo.
     */
    const handleExport = useCallback(() => {
        if (!level) return;
        const finalLevelName = levelName || level.name || 'untitled-level';
        const levelToExport = {
            ...level,
            name: finalLevelName
        };
        const cleanedLevel = JSON.parse(
            JSON.stringify(levelToExport, (key, value) =>
                (key === 'id' && value?.startsWith && value.startsWith('imported_')) ? undefined : value
            )
        );
        const encodedLevel = LevelEncoder.encode(cleanedLevel);
        if (!encodedLevel) {
            alert('Error al exportar el nivel');
            return;
        }
        navigator.clipboard.writeText(encodedLevel).then(() => {
            setExportedCode(encodedLevel);
            setExportDialogOpen(true);
        }).catch(err => {
            console.error('Error al copiar al portapapeles: ', err);
            alert('Error al copiar el código. Revisa la consola.');
        });
    }, [level, levelName, setExportedCode, setExportDialogOpen]);/**
     * Inicia el proceso de importación de un nivel mostrando el diálogo.
     */
    const handleImport = useCallback(() => {
        setImportDialogOpen(true);
    }, [setImportDialogOpen]);

    /**
     * Procesa el código de nivel importado una vez que el usuario confirma.
     * Si el código es válido, reconstruye el nivel y lo carga en el editor.
     * @param {string} code - El código del nivel a importar.
     */
    const handleImportConfirm = useCallback((code) => {
        if (!code) return;
        
        try {
            const importedLevel = LevelEncoder.decode(code);
            if (!importedLevel || typeof importedLevel.playerStart !== 'object' || typeof importedLevel.goal !== 'object') {
                throw new Error("Estructura del nivel inválida");
            }
            const reconstructedLevel = {
                ...createEmptyLevel(),
                ...importedLevel,
                id: levelIdParam === 'new' ? `imported_${Date.now()}` : levelIdParam,
                name: importedLevel.name || 'Nivel Importado',
                platforms: (importedLevel.platforms || []).map(p => new Platform(p)),
                obstacles: (importedLevel.obstacles || []).map(o => new Spike(o)),
                trampolines: (importedLevel.trampolines || []).map(t => new Trampoline(t)),
                portals: (importedLevel.portals || []).map(p => new Portal(p)),
                goal: new Goal(importedLevel.goal)
            };
            setLevel(reconstructedLevel);
            setHasUnsavedChanges(true);
            setLevelName(reconstructedLevel.name);            const maxPortalId = Math.max(0, ...(reconstructedLevel.portals || []).map(p => p.portalId || 0));
            setPortalCounter(maxPortalId + 1);
            setImportDialogOpen(false);
            setImportSuccessDialogOpen(true);
        } catch (error) {
            console.error('Error al importar el nivel:', error);
            alert('Error al importar el nivel: El código no es válido.');
        }
    }, [levelIdParam, setLevel, setHasUnsavedChanges, setLevelName, setPortalCounter, setImportDialogOpen]);    return {
        level,
        setLevel,
        levelName,
        setLevelName,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        saveDialogOpen,
        setSaveDialogOpen,
        importDialogOpen,
        setImportDialogOpen,
        exportDialogOpen,
        setExportDialogOpen,
        importSuccessDialogOpen,
        setImportSuccessDialogOpen,
        exportedCode,
        portalCounter,
        setPortalCounter,
        handleSave,
        handleSaveConfirm,
        handleExport,
        handleImport,
        handleImportConfirm,
    };
};
