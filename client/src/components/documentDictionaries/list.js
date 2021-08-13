import React from 'react';
import "../../styles/document.css";

export const toListDictionary = (index) => ({
    "<list>": { 
        cmp: index,  
        type: "list", 
        toComponent: (content, index) => (
            <div className="documentList" key={index}> 
                {content.map((item, i) => (
                    <div className="documentListItem" key={i}> - {item} </div>
                ))}
            </div>
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
            {children.map((item, i) => (
                <div className="documentListItem" key={i}> - {item} </div>
            ))}
        </div>
    )
}

export default DocumentList;
