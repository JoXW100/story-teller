import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../appContext';
import FileInput from '../fileInput';
import File from '../file';
import { addFile, fileSort, getChildFiles, moveFile, removeFile, renameFile } from '../fileSystem';
 
/**
 * @param {{ 
 *      file: DBFile,
 *      storyID: ObjectID,
 *      navigate: (id: ObjectID) => Promise<void>,
 *      selected: ObjectID,
 *      reloadSystem: () => void, 
 *      reloadParent: () => void
 * }} 
 * @returns {React.Component}
 */
const FolderFile = ({ file, storyID, navigate, selected, reloadParent }) => 
{
    const { menu, data } = useContext(Context);

    const getExpanded = () => {
        try
        {
            let a = JSON.parse(localStorage.getItem(`${data.storageKeys.folders}.${file._id}`));
            return a.expanded;
        }
        catch
        {
            return false;
        }
    }

    const [state, setState] = useState({ 
        loading: true, 
        files: [], 
        expanded: getExpanded(), 
        typing: false 
    });

    const reload = () => {
        setState({ ...state, loading: true });
        getChildFiles(file._id, (response) => response && setState({ ...state, loading: false, files: response.result }));
    }

    const done = (text) => {
        if (text !== file.content) renameFile(file._id, text, reloadParent);
        setState({ ...state, typing: false });
    }

    const contextMenu = (e) => 
    {
        e.preventDefault();
        if (e.currentTarget !== e.target ) return;
        menu.show({ x: e.pageX, y: e.pageY }, [
            { name: "Rename",       action: () => setState({ ...state, typing: true }) },
            { name: "Remove",       action: () => removeFile(file._id, reloadParent) },
            { name: "Add folder",   action: () => addFile(storyID, file._id, "folder", reload) },
            { name: "Add document", action: () => addFile(storyID, file._id, "doc", reload) },
            { name: "Add creature", action: () => addFile(storyID, file._id, "cre", reload) },
            { name: "Add ability",  action: () => addFile(storyID, file._id, "abi", reload) },
            { name: "Add spell",    action: () => addFile(storyID, file._id, "spe", reload) } 
        ]);
    }

    const allowDrop = (e) =>
    {
        e.preventDefault();
    }

    const drop = (e) =>
    {
        e.preventDefault();
        if(e.currentTarget !== e.target) return;
        moveFile(window.dragData["data"].object, file._id, () => window.location.reload());
    }

    useEffect(() => 
    {
        if (data.storageKeys.folders && file._id) 
            localStorage.setItem(`${data.storageKeys.folders}.${file._id}`, JSON.stringify({ expanded: state.expanded, time: Date.now() }));
    }, [state.expanded])

    useEffect(reload, [storyID]);

    return state.loading ? null : (
        state.typing ? 
            <FileInput 
                initialText={file.name} 
                setTyping={(value) => setState({ ...state, typing: value })} 
                done={done}
            />
        :
        <div className="folder">
            <div
                className="folderHeader"
                onClick={() => setState({ ...state, expanded: !state.expanded })}
                onContextMenu={contextMenu}
                onDragOver={allowDrop}
                onDrop={drop}
            > 
                {`${state.expanded ? '˅' : '>'} ${file.name}`}
            </div>

            { state.expanded &&
                <div className="folderContent">
                    { state.files.sort(fileSort).map((x, index) =>
                        <File
                            key={x.name + x._id + state.files.length + index}
                            data={x}
                            storyID={storyID}
                            navigate={navigate}
                            selected={selected}
                            reloadParent={reload}
                        />
                    )}
                </div>
            }
        </div>
    );
}

export default FolderFile;