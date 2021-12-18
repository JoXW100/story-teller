import React, { useEffect, useState } from 'react';
import Server from '../../server/server';
import DocumentLink from './link';
import DocumentText from './text';
import DocumentHeader3 from './header3';
import "../../styles/document.css";
import DocumentFunctions from '../../classes/documentFunctions';

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
 * @param {{ args: { target: String } }} 
 * @returns {React.ReactChild}
 */
const DocumentLinkContent = ({ args }) => 
{
    /** @type {[StoryDocument, React.Dispatch<React.SetStateAction<Story>>]} */
    const [document, setDocument] = useState(undefined);
    const validID = (id) => id && id.length === 24;

    useEffect(() => 
    {
        validID(args.target) && Server.files.get(args.target)
        .then((response) => response && setDocument(response.result))
        .catch(console.error());

        return () => setDocument(null);
    }, [args])

    return (
        <div className="documentBox"> 
            <DocumentLink args={args}> 
                <DocumentHeader3> {document?.data.title} </DocumentHeader3>
                <DocumentText>
                    {document?.data.short}
                </DocumentText>
            </DocumentLink>
        </div>
    );
}

export default DocumentLinkContent;