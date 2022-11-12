import React from 'react';
import "../styles/document.css";

export const toTableRowDictionary = (index) => ({
    "<row>": { 
        cmp: index,  
        type: "row", 
        toComponent: (content, index) => <DocumentTableRow key={index} content={content}/>
    },
    "</row>": { 
        cmp: -index
    }
});

const DocumentTableRow = ({ content }) => 
{
    return (
        <tr className="documentTableRow"> 
            { content.filter(x => typeof(x) !== typeof("")) } 
        </tr>
    )
}

export default DocumentTableRow;