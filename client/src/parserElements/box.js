import React from 'react';
import "../styles/document.css";

export const toBoxDictionary = (index) => ({
    "<box>":  { 
        cmp: index,  
        type: "box", 
        toComponent: (content, index) => 
            <DocumentBox key={index}> {content} </DocumentBox>
    },
    "</box>": { 
        cmp: -index
    }
});

const DocumentBox = ({children}) =>
{
    return (
        <div className="documentBox"> 
            {children} 
        </div>
    );
}

export default DocumentBox;