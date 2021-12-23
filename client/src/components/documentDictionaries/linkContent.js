import React, { useEffect, useState } from 'react';
import Server from '../../server/server';
import DocumentLink from './link';
import DocumentText from './text';
import DocumentHeader3 from './header3';
import DocumentFunctions from '../../classes/documentFunctions';
import { AbilityFile } from '../document/renders/abiRenderer';
import "../../styles/document.css";

export const toLinkContentDictionary = (index) => ({
    "<link-content>": { 
        cmp: index,  
        type: "link-content", 
        toComponent: (content, index) => (
            <DocumentLinkContent 
                key={index} 
                args={DocumentFunctions.contentToArgs(content, 'target')}
            />
        )
    },
    "</link-content>": { 
        cmp: -index
    }
});

/**
 * @param {{ args: { target: String, attributes: CreatureAttributes, proficiency: number } }} 
 * @returns {React.ReactChild}
 */
const DocumentLinkContent = ({ args }) => 
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

    const getDisplay = () => 
    {
        switch (state.document.type) {
            case "abi":
                return <AbilityFile document={state.document} attributes={args.attributes} proficiency={args.proficiency}/>
        
            default:
                return (
                    <div className="documentBox"> 
                        <DocumentLink args={args}>
                            <DocumentHeader3> {state.document.content.title} </DocumentHeader3>
                            <DocumentText>
                                {state.document.content.shortText}
                            </DocumentText>
                        </DocumentLink>
                    </div>
                );
        }
    }

    return state.loading ? null :  getDisplay();
}

export default DocumentLinkContent;