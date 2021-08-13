import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Context } from './appContext';
import '../styles/files.css';

/**
 * @typedef FileData
 * @property {(path: string) => Promise<void>} nav
 * @property {string} selected
 * @property {(parent: StoryFile, newParent: StoryFile, target: StoryFile) => Promise<void>} move
 * @property {(parent: StoryFile, target: StoryFile, name: string) => Promise<void>} rename
 * @property {(parent: StoryFile, target: StoryFile) => Promise<void>} remove
 * @property {(target: StoryFile) => Promise<void>} addFolder
 * @property {(target: StoryFile) => Promise<void>} addDocument
 */

/**
 * @param {{ story: Story, path: string, fileData: FileData}}
 * @returns {React.Component}
 */
const FileSystem = ({ story, fileData }) => 
{
    const sort = (a,b) => 
    {
        if (a.filetype === "folder")
        {
            if (b.filetype === "folder") return a.name.localeCompare(b.name);
            return -100;
        }
        if (b.filetype === "folder") return 100;
        return a.name.localeCompare(b.name);
    }

    return (
        <>
            <div className="storyMenuHeader"> Files </div>
            <File 
                data={story.introduction}
                parent={null}
                fileData={fileData}
                canEdit={false}
            />
            { story.files.sort(sort).map((file, index) => file.filetype === "folder" ?
                <Folder
                    key={index}
                    data={file}
                    parent={null}
                    fileData={fileData}
                />
                :
                <File
                    key={index}
                    data={file}
                    parent={null}
                    fileData={fileData}
                />
            )}
        </>
    );
}
 
/**
 * @param {{ data: StoryFile, parent: StoryFile, fileData: FileData, canEdit: boolean}} 
 * @returns {React.Component}
 */
const File = ({ data, parent, fileData, canEdit = true }) => 
{
    const [_, menu] = useContext(Context);
    const [typing, setTyping] = useState(false);

    const handleRename = useCallback(() => setTyping(true), [setTyping]);
    const handleRemove = useCallback(() => fileData.remove(parent, data), [fileData, parent, data]);

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
                { name: "Rename", action: handleRename},
                { name: "Remove", action: handleRemove}
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
 
/**
 * @param {{ data: StoryFile, parent: StoryFile, fileData: FileData, canEdit: boolean}} 
 * @returns {React.Component}
 */
const Folder = ({ data, parent, fileData, canEdit = true }) => 
{
    const [_, menu] = useContext(Context);
    const [expanded, setExpanded] = useState(true);
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
                    { data.content.sort((a,b) => a.name.localeCompare(b.name))
                                  .map((file, index) => file.filetype === "folder"
                        ?
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

/**
 * 
 * @param {{initialTest: string, setTyping: React.Dispatch<React.SetStateAction<boolean>>, done: (name: string) => void}} param0 
 * @returns {React.Component}
 */
const FileInput = ({ initialText, setTyping, done }) => 
{
    const [text, setText] = useState(initialText);
    const ref = useRef();

    const clickHandler = useCallback((e) => e.target !== ref.current && setTyping(false));


    useEffect(() => 
    {
        ref.current.focus();
    })

    useEffect(() => 
    {
        document.addEventListener("click", clickHandler);
        return () => {
            document.removeEventListener("click", clickHandler);
        }
    }, []);

    return (
        <input
            ref={ref}
            id={"fileRenameInput"}
            className={"file input"} 
            value={text}
            onChange={(e) => setText(e.target.value)}
            onContextMenu={(e) => e.preventDefault()}
            onKeyPress={(e) => e.key === "Enter" && done(text)}
            autoComplete="off"
        />
    );
}

export default FileSystem;
 