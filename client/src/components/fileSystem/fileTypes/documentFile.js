import React, { useContext, useState } from 'react';
import { Context } from '../../appContext';
import FileInput from '../fileInput';
import { removeFile, renameFile, setDefaultFile } from '../fileSystem';
 
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
    const { menu } = useContext(Context);
    const [typing, setTyping] = useState(false);

    const doneRenaming = (text) => 
    {
        if (text !== data.content.text)
        {
            renameFile(data._id, text, (response) => response && reloadParent());
        }

        setTyping(false);
    }

    const onRemove = (response) => 
    {
        if (response)
        {
            if (isSelected) 
            {
                reloadParent()
                navigate(null);
            }
            else reloadParent();
        }
    }

    const contextMenu = (e) => 
    {
        e.preventDefault();
        if (e.currentTarget !== e.target ) return;
        menu.show({ x: e.pageX, y: e.pageY }, [
            { name: "Open in new tab", action: () => navigate(data._id, true) },
            { name: "Rename",  action: () => setTyping(true) },
            { name: "Remove",  action: () => removeFile(data._id, onRemove) },
            { name: "Copy ID", action: () => navigator.clipboard.writeText(data._id)},
            { name: "Set Default", action: () => setDefaultFile(storyID, data._id, () => void 0)}
        ]);
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
            onClick={async () => navigate(data._id)}
            onContextMenu={contextMenu}
            onDragStart={drag}
            draggable={true}
        > 
            {`${data.name}.${data.type}`}
        </div>
    );
}

export default DocumentFile;
 