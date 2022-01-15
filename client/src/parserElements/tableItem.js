import React from 'react';
import "../styles/document.css";

export const toTableItemDictionary = (index) => ({
    "<item>": { 
        cmp: index,  
        type: "item", 
        toComponent: (content, index) => <DocumentTableItem key={index}> {content} </DocumentTableItem>
    },
    "</item>": { 
        cmp: -index
    }
});

const DocumentTableItem = ({ children }) => 
{
    return (
        <td className="documentTableItem"> 
            {children} 
        </td>
    )
}

export default DocumentTableItem;