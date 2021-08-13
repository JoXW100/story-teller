import React from 'react';
import "../../styles/document.css";

export const toGroupDictionary = (index) => ({
    "<group>": { 
        cmp: index,  
        type: "group", 
        toComponent: (content, index) => <DocumentGroup key={index}> {content} </DocumentGroup>
    },
    "</group>": { 
        cmp: -index
    }
});

const DocumentGroup = ({children}) => 
{
    return (
        <div className="documentGroup"> 
            {children} 
        </div>
    )
}

export default DocumentGroup;