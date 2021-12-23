import React from 'react';
import "../../styles/document.css";

export const toHeader4Dictionary = (index) => ({
    "<h4>": { 
        cmp: index,  
        type: "header4", 
        toComponent: (content, index) => <DocumentHeader4 key={index}>  {content} </DocumentHeader4>
    },
    "</h4>": { 
        cmp: -index 
    }
});

const DocumentHeader4 = ({ children }) => 
{
    return (
        <div className="documentHeader4"> 
            {children} 
        </div>
    )
}

export default DocumentHeader4;