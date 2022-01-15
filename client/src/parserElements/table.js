import React from 'react';
import "../styles/document.css";

export const toTableDictionary = (index) => ({
    "<table>": { 
        cmp: index,  
        type: "table", 
        toComponent: (content, index) => <DocumentTable key={index}> {content} </DocumentTable>
    },
    "</table>": { 
        cmp: -index
    }
});

const DocumentTable = ({ children }) => 
{
    return (
        <table className="documentTable"> 
            {children} 
        </table>
    )
}

export default DocumentTable;