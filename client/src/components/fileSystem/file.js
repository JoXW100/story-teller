import React from 'react';
import DocumentFile from './fileTypes/documentFile';
import FolderFile from './fileTypes/folderFile';
import '../../styles/files.css';
 
/**
 * @param {{ 
 *      data: DBFile,
 *      storyID: ObjectID,
 *      navigate: (id: ObjectID) => Promise<void>,
 *      getSelected: () => void,
 *      reloadParent: () => void
 * }} 
 * @returns {React.Component}
 */
const File = ({ data, storyID, navigate, getSelected, reloadParent}) => 
{
    switch (data.type) 
    {
        case "folder":
            return (
                <FolderFile
                    data={data}
                    storyID={storyID}
                    navigate={navigate}
                    getSelected={getSelected}
                    reloadParent={reloadParent}
                />
            );

        case "doc":
            return (
                <DocumentFile
                    data={data}
                    storyID={storyID}
                    isSelected={getSelected() === data._id}
                    navigate={navigate}
                    reloadParent={reloadParent}
                />
            );

        default:
            console.error("Unknown Filetype: " + data.type);
            return null;
    }
}

export default File;