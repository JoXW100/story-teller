import React from 'react';
import "../styles/document.css";

export const toTableDictionary = (index) => ({
    "<table>": { 
        cmp: index,  
        type: "table", 
        toComponent: (content, index) => <DocumentTable key={index} content={content}/>
    },
    "</table>": { 
        cmp: -index
    }
});

const DocumentTable = ({ content }) => 
{
    return (
        <table className="documentTable"> 
            <tbody>
                { content.filter(x => typeof(x) !== typeof("")) } 
            </tbody>
        </table>
    )
}

export default DocumentTable;