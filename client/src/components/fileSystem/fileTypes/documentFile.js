import React, { useContext, useState } from 'react';
import Server from '../../../server/server';
import { Context } from '../../appContext';
import FileInput from '../fileInput';
import { removeFile, renameFile } from '../fileSystem';
 
/**
 * @param {{ 
 *      data: DBFile,
 *      storyID: ObjectID,
 *      isSelected: boolean,
 *      navigate: (id: ObjectID) => Promise<void>,
 *      reloadParent: () => void
 * }} 
 * @returns {React.Component}
 */
const DocumentFile = ({ data, storyID, isSelected, navigate, reloadParent }) => 
{
    const [_, menu] = useContext(Context);
    const [typing, setTyping] = useState(false);

    const doneRenaming = (text) => 
    {
        if (text !== data.content.text)
        {
            renameFile(data._id, text, (response) => response && reloadParent());
        }

        setTyping(false);
    }

    const contextMenu = (e) => 
    {
        e.preventDefault();
        menu.set({ active: true, x: e.pageX, y: e.pageY, options: 
        [
            { name: "Rename",  action: () => setTyping(true) },
            { name: "Remove",  action: () => removeFile(data._id, reloadParent) },
            { name: "Copy ID", action: () => navigator.clipboard.writeText(data._id)}
        ]});
    }

    const drag = () =>
    {
        window.dragData["data"] = { object: data }
    }

    return ( typing ?
        <FileInput initialText={data.name} setTyping={setTyping} done={doneRenaming}/>
        :
        <div 
            className={isSelected ? "file selected" : "file"} 
            onClick={async () => await navigate(data._id)}
            onContextMenu={contextMenu}
            onDragStart={drag}
            draggable={true}
        > 
            {`${data.name}.${data.type}`}
        </div>
    );
}

export default DocumentFile;
 