import React, { useCallback, useContext, useState } from 'react';
import { Context } from '../appContext';
import FileInput from './fileInput';
import '../../styles/files.css';
 
/**
 * @param {{ data: StoryFileDocument, parent: StoryFile, fileData: import('./fileSystem').FileData, canEdit: boolean}} 
 * @returns {React.Component}
 */
const File = ({ data, parent, fileData, canEdit = true }) => 
{
    const [_, menu] = useContext(Context);
    const [typing, setTyping] = useState(false);

    const handleRename = useCallback(() => setTyping(true), [setTyping]);
    const handleRemove = useCallback(() => fileData.remove(parent, data), [fileData, parent, data]);
    const handleCopyID = useCallback(() => navigator.clipboard.writeText(data.content), [data]);

    const done = (text) => 
    {
        if (text !== data.name) fileData.rename(parent, data, text);
        setTyping(false);
    }

    const contextMenu = (e) => 
    {
        e.preventDefault();
        if (canEdit) menu.set({ active: true, x: e.pageX, y: e.pageY, options: 
            [
                { name: "Rename", action: handleRename },
                { name: "Remove", action: handleRemove },
                { name: "Copy ID", action: handleCopyID }
            ]});
    }

    const drag = () =>
    {
        window.dragData["data"] = { parent: parent, target: data }
    }

    return ( typing ?
        <FileInput initialText={data.name} setTyping={setTyping} done={done}/>
        :
        <div 
            className={fileData.selected === data.content ? "file selected" : "file"} 
            onClick={async () => await fileData.nav(data.content)}
            onContextMenu={contextMenu}
            onDragStart={drag}
            draggable={canEdit}
        > 
            {`${data.name}.${data.filetype}`}
        </div>
    );
}

export default File;
 