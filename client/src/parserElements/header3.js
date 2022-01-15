import React from 'react';
import "../styles/document.css";

export const toHeader3Dictionary = (index) => ({
    "<h3>": { 
        cmp: index,  
        type: "header3", 
        toComponent: (content, index) => <DocumentHeader3 key={index}> {content} </DocumentHeader3>
    },
    "</h3>": { 
        cmp: -index 
    }
});

const DocumentHeader3 = ({children}) => 
{
    return (
        <div className="documentHeader3"> 
            {children} 
        </div>
    )
}

export default DocumentHeader3;