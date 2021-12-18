import React, { useEffect, useState } from 'react';
import DocumentFunctions from '../../classes/documentFunctions';
import Server from '../../server/server';
import "../../styles/document.css";

export const toImageDictionary = (index) => ({
    "<image>": { 
        cmp: index,  
        type: "image", 
        toComponent: (content, index) => (
            <DocumentImage
                key={index} 
                args={DocumentFunctions.contentToArgs(content, 'imageID')}
            />
        )
    },
    "</image>": { 
        cmp: -index
    }
});

/**
 * @param {{ imageID: string }} 
 * @returns {React.ReactChild}
 */
const DocumentImage = ({ args }) => 
{
    const [image, setImage] = useState(null);
    const placeholder = window.location.origin + "/images/placeholder.png";
    const validID = (id) => id && id.length === 24;

    useEffect(() => 
    {
        if (validID(args.imageID))
        {
            Server.assets.get(args.imageID)
            .then((res) => res && setImage(URL.createObjectURL(res)))
            .catch(console.error());
        }
        else
        {
            setImage(null);
        }

        return () => setImage(null)

    }, [args])

    return (
        <div 
            className="documentImageContainer"
            style={args.flex ? { flex: args.flex } : {}}
        >
            <img
                alt={args.imageID}
                src={image || placeholder} 
                className="documentImage"
            />
        </div>
    );
}

export default DocumentImage;