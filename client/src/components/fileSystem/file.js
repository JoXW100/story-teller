import React from 'react';
import DocumentFile from './fileTypes/documentFile';
import FolderFile from './fileTypes/folderFile';
import '../../styles/files.css';
 
/**
 * @param {{ 
 *      data: DBFile,
 *      storyID: ObjectID,
 *      navigate: (id: ObjectID) => Promise<void>,
 *      selected: ObjectID,
 *      reloadParent: () => void
 * }} 
 * @returns {React.Component}
 */
const File = ({ data, storyID, navigate, selected, reloadParent}) => 
{
    switch (data.type) 
    {
        case "folder":
            return (
                <FolderFile
                    file={data}
                    storyID={storyID}
                    navigate={navigate}
                    selected={selected}
                    reloadParent={reloadParent}
                />
            );

        default:
            return (
                <DocumentFile
                    data={data}
                    storyID={storyID}
                    isSelected={selected === data._id}
                    navigate={navigate}
                    reloadParent={reloadParent}
                />
            );
    }
}

export default File;