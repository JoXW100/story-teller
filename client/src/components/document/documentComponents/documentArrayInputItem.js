import React, {  useContext } from 'react';
import { Context } from '../../appContext';

/**
 * @param {{ 
 *      type: string, 
 *      value: string, 
 *      setValue: (string) => void,
 *      onRemove: (index: number) => void 
 * }} 
 * @returns {React.Component}
 */
const DocumentArrayInputItem = ({ type, value, setValue, onRemove }) => 
{
    const { menu } = useContext(Context);

    const onContextMenu = (e) => 
    {
        e.preventDefault();
        menu.show({ x: e.pageX, y: e.pageY }, [{ name: "Remove",   action: onRemove }]);
    }

    return (
        <input 
            className="fileSectionItem"
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onContextMenu={onContextMenu}
        />
    );
}

export default DocumentArrayInputItem;