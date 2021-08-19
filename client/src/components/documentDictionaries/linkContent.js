import React, { useEffect, useState } from 'react';
import Server from '../../server/server';
import DocumentLink from './link';
import "../../styles/document.css";
import DocumentText from './text';
import DocumentHeader3 from './header3';

export const toLinkContentDictionary = (index) => ({
    "<link-content>": { 
        cmp: index,  
        type: "link-content", 
        toComponent: (content, index) => {
            let targetArgs = content.find((value) => typeof(value) === "string" && value.match(/\[(.*?)\]/));
            let targetID = targetArgs?.substring(1, targetArgs.length - 1);
            return <DocumentLinkContent key={index} targetID={targetID}/>;
        }
    },
    "</link-content>": { 
        cmp: -index
    }
})

/**
 * @param {{ targetID: string }} 
 * @returns {React.ReactChild}
 */
const DocumentLinkContent = ({ targetID }) => 
{
    /** @type {[StoryDocument, React.Dispatch<React.SetStateAction<Story>>]} */
    const [document, setDocument] = useState(undefined);
    const validID = (id) => id && id.length == 24;

    useEffect(() => 
    {
        validID(targetID) && Server.documents.get(targetID)
        .then((response) => response && setDocument(response.result))
        .catch(console.error());
    }, [targetID, window.localStorage.href])

    return (
        <div className="documentBox"> 
            <DocumentLink targetID={targetID}> 
                <DocumentHeader3> {document?.data.title} </DocumentHeader3>
            </DocumentLink>
            <DocumentText>
                {document?.data.short}
            </DocumentText>
        </div>
    );
}

export default DocumentLinkContent;