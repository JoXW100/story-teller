import React from 'react';
import "../styles/document.css";

export const toVGroupDictionary = (index) => ({
    "<v-group>": { 
        cmp: index,  
        type: "v-group", 
        toComponent: (content, index) => <DocumentVGroup key={index}> {content} </DocumentVGroup>
    },
    "</v-group>": { 
        cmp: -index
    }
});

const DocumentVGroup = ({children}) => 
{
    return (
        <div className="documentVerticalGroup"> 
            {children} 
        </div>
    )
}

export default DocumentVGroup;