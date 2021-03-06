import React, { useEffect, useState } from 'react';
import DocumentFunctions from '../classes/documentFunctions';
import Server from '../server/server';
import "../styles/document.css";

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
    const [state, setState] = useState({ image: null });
    const placeholder = window.location.origin + "/images/placeholder.png";
    const validID = (id) => id && id.length === 24;

    useEffect(() => 
    {
        if (validID(args.imageID))
        {
            Server.assets.getFile(args.imageID)
            .then((result) => result && setState({ image: URL.createObjectURL(result) }))
            .catch(console.error());
        }

        return () => URL.revokeObjectURL(state.image);
    }, [args]);

    return (
        <div 
            className="documentImageContainer"
            style={args.flex ? { flex: args.flex } : {}}
            key={args.imageID}
        >
            <img
                key={args.imageID}
                alt={args.imageID}
                src={state.image || placeholder} 
                className="documentImage"
            />
        </div>
    );
}

export default DocumentImage;