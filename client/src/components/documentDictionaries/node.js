import React from 'react';
import "../../styles/document.css";

export const toNodeDictionary = (index) => ({
    "<node>": { 
        cmp: index,  
        type: "node", 
        toComponent: (content, index) => <DocumentTreeNode key={index} content={content}/> 
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
const DocumentTreeNode = ({ content }) => 
{
    const [subNodes, items] = content.reduce(([pass, fail], elem) => (
        elem.type?.name === "documentTreeNode" 
            ? [[...pass, elem], fail] 
            : [pass, [...fail, elem]]
    ), [[], []]);
        
    return ( // {subNodes.length > 0 && <div className="documentNodeSubNodes"> {subNodes} </div>} 
        <div className="documentTreeNode"> 
            {items}
            
        </div>
    )
}

export default DocumentTreeNode;