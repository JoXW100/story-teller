import React from 'react';
import DocumentFunctions from '../classes/documentFunctions';
import "../styles/document.css";

export const toLinkDictionary = (index) => ({
    "<link>": { 
        cmp: index,  
        type: "link", 
        toComponent: (content, index) => (
            <DocumentLink 
                key={index} 
                args={DocumentFunctions.contentToArgs(content, 'target')}
                content={content}
            />
        ) 
    },
    "</link>": {
        cmp: -index
    }
});

/**
 * @param {{ args: { target: String }, children: [React.ReactChild]}} 
 * @returns {React.ReactChild}
 */
const DocumentLink = ({ args, content, children }) => 
{
    const validID = (id) => id && id.length === 24;
    const getHREF = () =>
    {
        let x = window.location.href.split(/\//);
        return `${x[0]}/${x[1]}/${x[2]}/${x[3]}/${x[4]}/${validID(args.target) ? args.target : x[5]}/${x[6]}`;
    }

    return (
        args.target && args.target.startsWith("http") 
        ? <a href={args.target} className="documentLink"> {content} </a>
        : <a href={getHREF()} className="documentLink"> {content} {children} </a>
    );
}

export default DocumentLink;