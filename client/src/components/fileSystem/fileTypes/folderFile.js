import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../appContext';
import FileInput from '../fileInput';
import File from '../file';
import { addFile, fileSort, getChildFiles, moveFile, removeFile, renameFile } from '../fileSystem';
 
/**
 * @param {{ 
 *      data: DBFile,
 *      storyID: ObjectID,
 *      navigate: (id: ObjectID) => Promise<void>,
 *      selected: ObjectID,
 *      reloadSystem: () => void, 
 *      reloadParent: () => void
 * }} 
 * @returns {React.Component}
 */
const FolderFile = ({ data, storyID, navigate, selected, reloadParent }) => 
{
    const { menu } = useContext(Context);
    const [state, setState] = useState({ loading: true, files: [], expanded: true, typing: false });

    const reload = () => {
        setState({ ...state, loading: true });
        getChildFiles(data._id, (response) => response && setState({ ...state, loading: false, files: response.result }));
    }

    const done = (text) => {
        if (text !== data.content) renameFile(data._id, text, reloadParent);
        setState({ ...state, typing: false });
    }

    const contextMenu = (e) => 
    {
        e.preventDefault();
        if (e.currentTarget !== e.target ) return;
        menu.show({ x: e.pageX, y: e.pageY }, [
            { name: "Rename",       action: () => setState({ ...state, typing: true }) },
            { name: "Remove",       action: () => removeFile(data._id, reloadParent) },
            { name: "Add folder",   action: () => addFile(storyID, data._id, "folder", reload) },
            { name: "Add document", action: () => addFile(storyID, data._id, "doc", reload) },
            { name: "Add creature", action: () => addFile(storyID, data._id, "cre", reload) },
            { name: "Add ability",  action: () => addFile(storyID, data._id, "abi", reload) } 
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
        moveFile(window.dragData["data"].object, data._id, () => window.location.reload());
    }

    useEffect(reload, [storyID]);

    return state.loading ? null : (
        state.typing ? 
            <FileInput 
                initialText={data.name} 
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
                {`${state.expanded ? '˅' : '>'} ${data.name}`}
            </div>

            { state.expanded &&
                <div className="folderContent">
                    { state.files.sort(fileSort).map((file, index) =>
                        <File
                            key={file.name + data._id + state.files.length + index}
                            data={file}
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