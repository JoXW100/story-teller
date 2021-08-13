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
            return <DocumentImage key={index} srcID={imageID}/>;
        }
    },
    "</image>": { 
        cmp: -index
    }
});

const DocumentImage = ({ srcID }) => 
{
    const [image, setImage] = useState();

    useEffect(() => 
    {
        Server.images.get(srcID)
        .then((response) => response && setImage(response))
        .catch(console.error());
    }, [srcID])

    return <div className="documentImageContainer">
        <img alt={image} src={image && URL.createObjectURL(image)} className="documentImage"/>
    </div>
}

export default DocumentImage;