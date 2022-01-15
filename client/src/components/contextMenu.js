import React, { useEffect } from 'react';
import '../styles/contextMenu.css';



/**
 * 
 * @param {{state: import('./appContext').ContextMenuParams }} 
 * @returns 
 */
const ContextMenu = ({ state, hide }) => 
{
    const clickHandler = (e) => e.target.className !== "contextMenuItem"  && state.active && hide();

    useEffect(() => 
    {
        document.addEventListener("click", clickHandler, true);
        return () => document.removeEventListener("click", clickHandler, true);
    }, [clickHandler]);

    return state.active ? (
        <div id="contextMenu" style={{ left: state.coords.x, top: state.coords.y }}>
            {state.options.map(({name, action}, index) => (
                <div
                    key={index}
                    className="contextMenuItem"
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={() => action() & hide()}
                >
                    {name}
                </div>
            ))}
        </div>
    ) : null;
}

export default ContextMenu;