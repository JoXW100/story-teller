import React from 'react';
import "../../styles/document.css";

export const toBoldDictionary = (index) => ({
    "<bold>": { 
        cmp: index,  
        type: "bold", 
        toComponent: (content, index) => <DocumentBold key={index}> {content} </DocumentBold>
    },
    "</bold>": { 
        cmp: -index
    }
});

const DocumentBold = ({children}) => 
{
    return (
        <div className="documentBold"> 
            {children} 
        </div>
    )
}

export default DocumentBold;