import React from 'react';
import File from './file';
import Folder from './folder';
import '../../styles/files.css';

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
    return (
        <>
            <div className="storyMenuHeader"> Files </div>
            <File 
                data={story.introduction}
                parent={null}
                fileData={fileData}
                canEdit={false}
            />
            { story.files.sort(fileSort).map((file, index) => file.filetype === "folder" ?
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

export const fileSort = (a, b) => 
{
    if (a.filetype === "folder")
    {
        if (b.filetype === "folder") return a.name.localeCompare(b.name);
        return -1000;
    }
    if (b.filetype === "folder") return 1000;
    return a.name.localeCompare(b.name);
}

export default FileSystem;