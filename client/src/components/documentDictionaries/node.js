import React from 'react';
import "../../styles/document.css";

export const toNodeDictionary = (index) => ({
    "<node>": { 
        cmp: index,  
        type: "node", 
        toComponent: (content, index) => <DocumentNode key={index} content={content}/> 
    },
    "</node>": { 
        cmp: -index 
    }
});

/**
 * 
 * @param {{ content: [React.ReactNode] }} 
 * @returns {React.ReactNode}
 */
const DocumentNode = ({ content }) => 
{
    const [subNodes, items] = content.reduce(([pass, fail], elem) => (
        elem.type?.name === "DocumentNode" 
            ? [[...pass, elem], fail] 
            : [pass, [...fail, elem]]
    ), [[], []]);

    return (
        <div className="documentNode"> 
            {items}
            {subNodes.length > 0 && <div className="documentNodeSubNodes"> {subNodes} </div>}
        </div>
    )
}

export default DocumentNode;