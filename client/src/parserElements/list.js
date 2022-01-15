import React from 'react';
import "../styles/document.css";

export const toListDictionary = (index) => ({
    "<list>": { 
        cmp: index,  
        type: "list", 
        toComponent: (content, index) => (
            <DocumentList key={index}> {content} </DocumentList>
        )
    },
    "</list>": { 
        cmp: -index
    }
});

const DocumentList = ({ children }) => 
{
    return (
        <div className="documentList"> 
            {children[1].map((item, i) => (
                <DocumentListItem key={i} number={i + 1}> {item} </DocumentListItem>
            ))}
        </div>
    );
}

export const DocumentListItem = ({ children, number }) => 
{
    return (
        <div>
            {`(${number})`} {children}
        </div>
    );
}

export default DocumentList;
