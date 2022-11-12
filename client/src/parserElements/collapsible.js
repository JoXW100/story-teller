import React, { useState } from 'react';
import DocumentFunctions from '../classes/documentFunctions';
import DocumentParser from '../classes/documentParser';
import "../styles/document.css";

export const toCollapsibleDictionary = (index) => ({
    "<collapsible>":  { 
        cmp: index,  
        type: "collapsible", 
        toComponent: (content, index) => (
            <DocumentCollapsible 
                key={index} 
                args={DocumentFunctions.contentToArgs(content, 'text')}
                content={content}
            />
        )
    },
    "</collapsible>": { 
        cmp: -index
    }
});

const DocumentCollapsible = ({ args, content }) =>
{
    const [isOpen, setIsOpen] = useState(args.default ? args.default === "true" : true);

    return (
        <div className="documentCollapsible">
            <div 
                className="documentCollapsibleHeader"
                onClick={() => setIsOpen(args.text && !isOpen)}
            >
                { content ? content : "Content..." }
            </div>
            { isOpen &&
                <div className='documentCollapsibleContent'> 
                    {DocumentParser.parse(args.text)}  
                </div>
            }
        </div>
    );
}

export default DocumentCollapsible;