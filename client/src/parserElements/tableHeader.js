import React, { useEffect, useState } from 'react';
import DocumentFunctions from '../classes/documentFunctions';
import "../styles/document.css";

export const toTableHeaderDictionary = (index) => ({
    "<header>": { 
        cmp: index,  
        type: "header", 
        toComponent: (content, index) => (
            <DocumentTableHeader 
                key={index} 
                args={DocumentFunctions.contentToArgs(content, 'width')}
            > 
                {content} 
            </DocumentTableHeader>
        )
    },
    "</header>": { 
        cmp: -index
    }
});

const DocumentTableHeader = ({ children, args }) => 
{
    const [state, setState] = useState({ width: null });

    useEffect(() => 
    {
        if (args.width) setState({ width: args.width });
    }, [args])

    return (
        <td 
            className="documentTableHeader"
            style={state.width ? { width: state.width } : {}}
        > 
            {children} 
        </td>
    )
}

export default DocumentTableHeader;