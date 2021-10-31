import React from 'react';
import "../../styles/document.css";

export const toFillDictionary = (index) => ({
    "<fill>": { 
        cmp: index,  
        type: "fill", 
        toComponent: (content, index) => <DocumentFill key={index} content={content}/>
    },
    "</fill>": { 
        cmp: -index 
    }
});

const DocumentFill = ({ content }) => 
{
    return (
        <div className="documentFill"> 
            {content} 
        </div>
    )
}

export default DocumentFill;