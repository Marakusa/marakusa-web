import React from 'react';

interface ContextMenuProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ children, className, style }) => {
    return (
        <div className={`context-menu ${className ?? ''}`} style={style}>
            {children}
        </div>
    );
};

export default ContextMenu;