import React from 'react';
import "../styles/document.css";

export const toTableRowDictionary = (index) => ({
    "<row>": { 
        cmp: index,  
        type: "row", 
        toComponent: (content, index) => <DocumentTableRow key={index}> {content} </DocumentTableRow>
    },
    "</row>": { 
        cmp: -index
    }
});

const DocumentTableRow = ({ children }) => 
{
    return (
        <tr className="documentTableRow"> 
            {children} 
        </tr>
    )
}

export default DocumentTableRow;