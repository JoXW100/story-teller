import React, {  useRef, useContext } from 'react';
import { Context } from '../../appContext';
import Server from '../../../server/server';

/**
 * @param {{ asset: DBAsset, refresh: () => void }} 
 * @returns {React.Component}
 */
const DocumentEditFileSectionItem = ({ asset, refresh }) => 
{
    const { menu } = useContext(Context);
    const download = useRef();

    const handleRemove = () => {
        Server.assets.remove(asset._id)
        .then((response) => response && refresh())
        .catch(console.error());
    }

    const handleCopyID = () => navigator.clipboard.writeText(asset.assetFileID);

    const handleDownload =() => 
    {
        Server.assets.getFile(asset.assetFileID)
        .then((response) => {
            if (response)
            {
                download.current.href = URL.createObjectURL(response);
                download.current.click();
                URL.revokeObjectURL(download.current.href);
            }
        })
        .catch(console.error());
    };

    const onContextMenu = (e) => 
    {
        e.preventDefault();
        menu.show({ x: e.pageX, y: e.pageY }, [
            { name: "Remove",   action: handleRemove },
            { name: "Copy ID",  action: handleCopyID },
            { name: "Download", action: handleDownload }
        ]);
    }

    return (
        <div 
            className="fileSectionItem"
            onContextMenu={onContextMenu}
        >
            {asset ? asset.name : ""}
            <a ref={download} download={asset ? asset.name : ""}/>
        </div>
    );
}

export default DocumentEditFileSectionItem;