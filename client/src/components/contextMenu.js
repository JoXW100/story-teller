import React, { useCallback, useEffect } from 'react';
import '../styles/contextMenu.css';

/**
 * @typedef ContextMenuParams
 * @type {{ active: boolean, x: number, y:number, options: [{ name: string, action: () => void }]}}
 */

/**
 * 
 * @param {{state: ContextMenuParams, setState: React.Dispatch<React.SetStateAction<ContextMenuParams>>}} 
 * @returns 
 */
const ContextMenu = ({state, setState}) => 
{
    const clickHandler = useCallback((e) => e.target.className !== "contextMenuItem" 
                      && state.active
                      && setState({...state, active: false}), [state, setState]);

    useEffect(() => 
    {
        document.addEventListener("click", clickHandler, true);
        return () => document.removeEventListener("click", clickHandler, true);
    });

    return state.active ? (
        <div id="contextMenu" style={{ left: state.x, top: state.y }}>
            {state.options.map(({name, action}, index) => (
                <div
                    key={index}
                    className="contextMenuItem"
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={() => { 
                        action(); 
                        setState({...state, active: false}); 
                    }}
                >
                    {name}
                </div>
            ))}
        </div>
    ) : null;
}

export default ContextMenu;