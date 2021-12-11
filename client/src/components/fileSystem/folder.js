import React, { useCallback, useContext, useState } from 'react';
import { Context } from '../appContext';
import FileInput from './fileInput';
import File from './file';
import '../../styles/files.css';
import { fileSort } from './fileSystem';
 
/**
 * @param {{ data: StoryFile, parent: StoryFile, fileData: import('./fileSystem').FileData, canEdit: boolean}} 
 * @returns {React.Component}
 */
const Folder = ({ data, parent, fileData, canEdit = true }) => 
{
    const [_, menu] = useContext(Context);
    const [expanded, setExpanded] = useState(false);
    const [typing, setTyping] = useState(false);

    const handleRename      = useCallback(() => setTyping(true),               [setTyping]);
    const handleRemove      = useCallback(() => fileData.remove(parent, data), [fileData, parent, data]);
    const handleAddFolder   = useCallback(() => fileData.addFolder(data),      [fileData, data]);
    const handleAddDocument = useCallback(() => fileData.addDocument(data),    [fileData, data]);

    const done = (text) => {
        if (text !== data.content) fileData.rename(parent, data, text);
        setTyping(false);
    }

    const contextMenu = (e) => 
    {
        e.preventDefault();
        menu.set({ active: true, x: e.pageX, y: e.pageY, options: canEdit ?
            [
                { name: "Rename",       action: handleRename},
                { name: "Remove",       action: handleRemove},
                { name: "Add folder",   action: handleAddFolder },
                { name: "Add document", action: handleAddDocument }
            ]
            :
            [
                { name: "Add folder",   action: handleAddFolder },
                { name: "Add document", action: handleAddDocument }
            ]
        })
    }

    const allowDrop = (e) =>
    {
        e.preventDefault();
    }

    const drop = (e) =>
    {
        e.preventDefault();
        var transfer = window.dragData["data"];
        fileData.move(transfer.parent, data, transfer.target);
    }

    return ( typing ?
        <FileInput initialText={data.name} setTyping={setTyping} done={done}/>
        :
        <div className="folder">
            <div
                className="folderHeader"
                onClick={() => setExpanded(!expanded)}
                onContextMenu={contextMenu}
                onDragOver={allowDrop}
                onDrop={drop}
            > 
                {`${expanded ? '˅' : '˃'} ${data.name}`}
            </div>

            { expanded &&
                <div className="folderContent">
                    { data.content.sort(fileSort).map((file, index) => file.filetype === "folder" ?
                        <Folder 
                            key={index}
                            data={file}
                            parent={data}
                            fileData={fileData}
                        />
                        :
                        <File
                            key={index}
                            data={file}
                            parent={data}
                            fileData={fileData}
                        />
                    )}
                </div>
            }
        </div>
    );
}

export default Folder;