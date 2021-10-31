import React, { useEffect, useState } from 'react';
import Server from '../../server/server';
import "../../styles/document.css";

export const toImageDictionary = (index) => ({
    "<image>": { 
        cmp: index,  
        type: "image", 
        toComponent: (content, index) => {
            let targetArgs = content.find((value) => typeof(value) === "string" && value.match(/\[(.*?)\]/));
            let imageID = targetArgs?.substring(1, targetArgs.length - 1);
            return <DocumentImage key={index} imageID={imageID}/>;
        }
    },
    "</image>": { 
        cmp: -index
    }
});

/**
 * @param {{ imageID: string }} 
 * @returns {React.ReactChild}
 */
const DocumentImage = ({ imageID }) => 
{
    const [image, setImage] = useState();
    const placeholder = window.location.origin + "/images/placeholder.png";
    const validID = (id) => id && id.length === 24;

    useEffect(() => 
    {
        validID(imageID) && Server.images.get(imageID)
        .then((response) => response && setImage(response))
        .catch(console.error());
    }, [imageID])

    return <div className="documentImageContainer">
        <img alt={""} src={(image && URL.createObjectURL(image)) || placeholder} className="documentImage"/>
    </div>
}

export default DocumentImage;