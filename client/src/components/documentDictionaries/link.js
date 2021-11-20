import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/document.css";

export const toLinkDictionary = (index) => ({
    "<link>": { 
        cmp: index,  
        type: "link", 
        toComponent: (content, index) => 
        {
            let itemIndex = content.findIndex((value) => typeof(value) === "string" && value.match(/\[(.*?)\]/));
            let targetID = content[itemIndex]?.split(/\[(.*?)\]/)[1];
            content[itemIndex] = content[itemIndex]?.replace(`[${targetID}]`, "").trim();
            
            return <DocumentLink key={index} targetID={targetID}> {content} </DocumentLink>; 
        }
    },
    "</link>": { 
        cmp: -index
    }
});

/**
 * @param {{ targetID: string, children: [React.ReactChild]}} 
 * @returns {React.ReactChild}
 */
const DocumentLink = ({ targetID, children }) => 
{
    const href = window.location.href.split(/\//);
    const validID = (id) => id && id.length === 24;

    return (
        targetID && targetID.startsWith("http") ?
        <a href={targetID} className="documentLink"> {children} </a>
        :
        <Link 
            className="documentLink"
            to={`/stories/${href[4]}/${validID(targetID) ? targetID : href[5]}/${href[6]}`}
        > 
            {children} 
        </Link>
    );
}

export default DocumentLink;