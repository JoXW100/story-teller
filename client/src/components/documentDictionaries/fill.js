import React from 'react';
import "../../styles/document.css";

export const toFillDictionary = (index) => ({
    "<fill>": { 
        cmp: index,  
        type: "fill", 
        toComponent: (content, index) => <DocumentFill key={index}> {content} </DocumentFill>
    },
    "</fill>": { 
        cmp: -index 
    }
});

const DocumentFill = ({children}) => 
{
    return (
        <div className="documentFill"> 
            {children} 
        </div>
    )
}

export default DocumentFill;