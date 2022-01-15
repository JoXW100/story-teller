import React from 'react';
import "../styles/document.css";

export const toAlignDictionary = (index) => ({
    "<align>": { 
        cmp: index,  
        type: "align", 
        toComponent: (content, index) => <DocumentAlign key={index}> {content} </DocumentAlign>
    },
    "</align>": { 
        cmp: -index
    }
});

const DocumentAlign = ({ children }) => 
{
    return (
        <div className="documentAlign"> 
            {children} 
        </div>
    )
}

export default DocumentAlign;