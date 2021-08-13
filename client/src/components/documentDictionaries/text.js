import React from 'react';
import "../../styles/document.css";

export const toTextDictionary = (index) => ({
    "<text>": { 
        cmp: index,  
        type: "textBox", 
        toComponent: (content, index) => <DocumentText key={index}> {content} </DocumentText>
    },
    "</text>": { 
        cmp: -index
    }
});

const DocumentText = ({children}) => 
{
    return (
        <div className="documentText"> 
            {children} 
        </div>
    )
}

export default DocumentText;