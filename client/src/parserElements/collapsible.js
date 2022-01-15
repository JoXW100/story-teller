import React, { useState } from 'react';
import DocumentFunctions from '../classes/documentFunctions';
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
                onClick={(e) => e.currentTarget === e.target && setIsOpen(!isOpen)}
            >
                { args.text ? args.text : "header text..." }
            </div>
            { isOpen &&
                <div className='documentCollapsibleContent'> 
                    {content}  
                </div>
            }
        </div>
    );
}

export default DocumentCollapsible;