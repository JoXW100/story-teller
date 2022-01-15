import React, { useEffect, useState } from 'react';
import Server from '../server/server';
import DocumentFunctions from '../classes/documentFunctions';
import DocumentLink from './link';
import DocumentText from './text';
import DocumentHeader3 from './header3';
import "../styles/document.css";

export const toLinkTitleDictionary = (index) => ({
    "<link-title>": { 
        cmp: index,  
        type: "link-title", 
        toComponent: (content, index) => (
            <DocumentLinkTitle 
                key={index} 
                args={DocumentFunctions.contentToArgs(content, 'target')}
            />
        )
    },
    "</link-title>": { 
        cmp: -index
    }
});

/**
 * @param {{ args: { target: String, bold: boolean } }} 
 * @returns {React.ReactChild}
 */
const DocumentLinkTitle = ({ args }) => 
{
    /** @type {[{ loading: boolean, document: DBFile }, React.Dispatch<React.SetStateAction<DBFile>>]} */
    const [state, setState] = useState({ loading: true, document: null });
    const validID = (id) => id && id.length === 24;

    useEffect(() =>
    {
        validID(args.target) && Server.files.get(args.target)
        .then((response) => response && setState({ loading: false, document: response.result }))
        .catch(console.error());
    }, [args]);

    const getHeader = () =>
    {
        switch (state.document?.type) 
        {
            case "doc":
                return state.document.content.title;

            case "abi":
                return state.document.content.name;

            case "spe":
                return state.document.content.name;
        
            case "cre":
                return state.document.content.name;

            default:
                return "";
        }
    }

    const getDisplay = () => (
        <DocumentLink args={args}>
            { args.bold  ?
                <DocumentHeader3> {getHeader()} </DocumentHeader3>
                :
                getHeader()
            }
        </DocumentLink>
    );

    return state.loading ? null :  getDisplay();
}

export default DocumentLinkTitle;