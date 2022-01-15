import React from 'react';
import "../styles/document.css";

export const toHeader2Dictionary = (index) => ({
    "<h2>": { 
        cmp: index,  
        type: "header2", 
        toComponent: (content, index) => <DocumentHeader2 key={index}> {content} </DocumentHeader2>
    },
    "</h2>": { 
        cmp: -index 
    }
});

const DocumentHeader2 = ({children}) => 
{
    return (
        <div className="documentHeader2"> 
            {children} 
        </div>
    )
}

export default DocumentHeader2;