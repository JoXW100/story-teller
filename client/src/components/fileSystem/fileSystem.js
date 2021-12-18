import React, { useContext, useEffect, useRef, useState } from 'react';
import File from './file';
import Server from '../../server/server';
import { Context } from '../appContext';
import '../../styles/files.css';

/**
 * @param {{ 
 *      storyID: ObjectID,
 *      navigate: (id: ObjectID) => Promise<void>,
 *      getSelected: () => void
 * }}
 * @returns {React.Component}
 */
const FileSystem = ({ storyID, navigate, getSelected }) => 
{
    const [files, setFiles] = useState([]);
    const [_, menu] = useContext(Context);
    const menuRef = useRef(null);

    const reload = () => storyID && getChildFiles(storyID, (response) => response && setFiles(response.result));

    useEffect(reload, [storyID])

    const contextMenu = (e) => 
    {
        e.preventDefault();
        if(e.currentTarget != e.target ) return;
        menu.set({ active: true, x: e.pageX, y: e.pageY, options: 
            [
                { name: "Add folder",   action: () => addFile(storyID, storyID, "folder", reload) },
                { name: "Add document", action: () => addFile(storyID, storyID, "doc", reload)}
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
        if(e.currentTarget != e.target ) return;
        moveFile(window.dragData["data"].object, storyID, reload);
    }

    return (
        <div
            id={"fileMenu"}
            className="fileMenu"
            ref={menuRef}
            onContextMenu={contextMenu}
            onDragOver={allowDrop}
            onDrop={drop}
        >
            <div className="storyMenuHeader"> Files </div>
            { files?.sort(fileSort).map((file, index) =>
                <File
                    key={files.length + index}
                    data={file}
                    storyID={storyID}
                    navigate={navigate}
                    getSelected={getSelected}
                    reloadParent={reload}
                />
            )}
        </div>
    );
}

export const fileSort = (a, b) => 
{
    if (a.type === "folder")
    {
        if (b.type === "folder") return a.name.localeCompare(b.name);
        return -1000;
    }
    if (b.type === "folder") return 1000;
    return a.name.localeCompare(b.name);
}

export const addFile = (storyID, holderID, type, then) => 
{
    let content;
    let name;
    switch (type) {
        case "doc":
            name = "newDocument";
            content = { 
                text: "The document body", 
                data: {
                    title: "New Document",
                    shortText: "a small description"
                }
            }
            break;

        case "folder":
            name = "newFolder";
            content = {}
            break;

        default:
            console.error("Unknown filetype:", type);
            return;
    }

    Server.files.add(storyID, holderID, name, type, content)
        .catch(console.error())
        .then(then);
}

export const removeFile = (fileID, then) => 
{
    Server.files.remove(fileID)
    .catch(console.error())
    .then(then);
}

export const renameFile = (fileID, name, then) => 
{
    Server.files.update(fileID, { name: name })
    .catch(console.error())
    .then(then);
}

export const moveFile = (file, parentID, then) => 
{
    if (file.holderID === parentID) return;
    Server.files.update(file._id, { holderID: parentID })
    .catch(console.error())
    .then(then);
}

export const getChildFiles = (fileID, then) => 
{
    Server.files.getAllChildren(fileID)
    .catch(console.error())
    .then(then);
}

export const getFileArray = (fileIDs, then) => 
{
    let promises = new Array(fileIDs.length)
    for (let index = 0; index < promises.length; index++) 
    {
        promises[index] = Server.files.get(fileIDs[index]);
    }

    Promise.all(promises)
    .catch(console.error())
    .then((responses) => then(
        { result: responses.reduce((files, response) => response 
            ? { successful: files.successful, result: [...(files.result), response.result] }
            : { successful: false, result: files.result }, 
        { successful: true, result: [] })}));
}

export default FileSystem;