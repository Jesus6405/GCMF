import React from 'react';

export function AlertBadge({ type, status }) {
    // Definición de colores según el status
    let bgColor = '';
    let textColor = '#fff';
    let label = '';

    switch (status) {
        case 'VERDE':
            bgColor = '#10B981'; // Verde Esmeralda
            label = 'Óptimo';
            break;
        case 'AMARILLO':
            bgColor = '#F59E0B'; // Amarillo Ámbar
            label = 'Advertencia';
            break;
        case 'ROJO':
            bgColor = '#DC2626'; // Rojo Carmesí
            label = 'Crítico';
            break;
        case 'NARANJA':
            bgColor = '#F97316'; // Naranja de Seguridad
            label = 'En Revisión';
            break;
        default:
            bgColor = '#9CA3AF'; // Gris por defecto
            label = 'N/A';
            break;
    }

    // Definición de iconos según el type
    const icon = type === 'legal' ? '📄' : '🔧';

    const badgeStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: bgColor,
        color: textColor,
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    return (
        <span style={badgeStyle} title={label}>
            <span>{icon}</span>
            <span>{label}</span>
        </span>
    );
}
