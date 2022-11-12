import React from 'react';
import "../styles/document.css";

export const toHeader5Dictionary = (index) => ({
    "<h5>": { 
        cmp: index,  
        type: "header5", 
        toComponent: (content, index) => <DocumentHeader5 key={index}>  {content} </DocumentHeader5>
    },
    "</h5>": { 
        cmp: -index 
    }
});

const DocumentHeader5 = ({ children }) => 
{
    return (
        <div className="documentHeader5"> 
            {children} 
        </div>
    )
}

export default DocumentHeader5;