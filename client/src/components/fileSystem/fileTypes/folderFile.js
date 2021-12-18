import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../appContext';
import FileInput from '../fileInput';
import File from '../file';
import { addFile, fileSort, getChildFiles, moveFile, removeFile, renameFile } from '../fileSystem';
import Server from '../../../server/server';
 
/**
 * @param {{ 
 *      data: DBFile,
 *      storyID: ObjectID,
 *      navigate: (id: ObjectID) => Promise<void>,
 *      getSelected: () => void,
 *      reloadSystem: () => void, 
 *      reloadParent: () => void
 * }} 
 * @returns {React.Component}
 */
const FolderFile = ({ data, storyID, navigate, getSelected, reloadParent }) => 
{
    const [_, menu] = useContext(Context);
    const [files, setFiles] = useState([]);
    const [expanded, setExpanded] = useState(true);
    const [typing, setTyping] = useState(false);

    const reload = () => getChildFiles(data._id, (response) => response && setFiles(response.result));
    useEffect(reload, [storyID])

    const done = (text) => {
        if (text !== data.content) renameFile(data._id, text, reloadParent);
        setTyping(false);
    }

    const contextMenu = (e) => 
    {
        e.preventDefault();
        if (e.currentTarget != e.target ) return;
        menu.set({ active: true, x: e.pageX, y: e.pageY, options: [
            { name: "Rename",       action: () => setTyping(true) },
            { name: "Remove",       action: () => removeFile(data._id, reloadParent) },
            { name: "Add folder",   action: () => addFile(storyID, data._id, "folder", reload) },
            { name: "Add document", action: () => addFile(storyID, data._id, "doc", reload) }
        ]});
    }

    const allowDrop = (e) =>
    {
        e.preventDefault();
    }

    const drop = (e) =>
    {
        e.preventDefault();
        if(e.currentTarget != e.target ) return;
        moveFile(window.dragData["data"].object, data._id, () => window.location.reload());
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
                {`${expanded ? '˅' : '>'} ${data.name}`}
            </div>

            { expanded &&
                <div className="folderContent">
                    { files?.sort(fileSort).map((file, index) =>
                        <File
                            key={data._id + files.length + index}
                            data={file}
                            storyID={storyID}
                            navigate={navigate}
                            getSelected={getSelected}
                            reloadParent={reload}
                        />
                    )}
                </div>
            }
        </div>
    );
}

export default FolderFile;