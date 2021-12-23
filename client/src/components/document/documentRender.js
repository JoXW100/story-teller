import React, { useEffect, useState } from 'react';
import CreRenderer from './renders/creRenderer';
import DocRenderer from './renders/docRenderer';
import AbiRenderer from './renders/abiRenderer';
import DocumentAlign from '../documentDictionaries/align';
import DocumentBox from '../documentDictionaries/box';
import DocumentFill from '../documentDictionaries/fill';
import DocumentHeader2 from '../documentDictionaries/header2';
import DocumentHeader3 from '../documentDictionaries/header3';
import DocumentHeader4 from '../documentDictionaries/header4';
import DocumentImage from '../documentDictionaries/image';
import DocumentLinkContent from '../documentDictionaries/linkContent';
import DocumentRoll from '../documentDictionaries/roll';
import DocumentText from '../documentDictionaries/text';
import DocumentVGroup from '../documentDictionaries/vGroup';
import "../../styles/document.css";

/**
 * 
 * @param {{ document: DBFile }} 
 * @returns {React.Component}
 */
const DocumentRender = ({ document }) => 
{
    const [state, setState] = useState({ loaded: false, content: null })

    const generateDocument = () => 
    {
        switch (document.type) {
            case "cre":
                return <CreRenderer document={document}/>;

            case "abi":
                return <AbiRenderer document={document}/>;
        
            default:
                return <DocRenderer document={document}/>;
        }
    }

    useEffect(() => setState({ loaded: true, content: generateDocument() }), [document])
    
    return state.loaded ? state.content : null;
}

export const documentToComponent = (x, key = 0) => 
{
    switch (x.type) {
        
        case "bold":
            return <b key={key} children={x.content}/>

        case "text":
            return <DocumentText key={key} children={x.content.map((y, index) => documentToComponent(y, index))}/>
        
        case "v-group":
            return <DocumentVGroup key={key} children={x.content.map((y, index) => documentToComponent(y, index))}/>

        case "roll":
            return <DocumentRoll key={key} args={x.args} children={x.content.map((y, index) => documentToComponent(y, index))}/>

        case "align":
            return <DocumentAlign key={key} children={x.content.map((y, index) => documentToComponent(y, index))}/>

        case "fill":
            return <DocumentFill key={key} content={x.content.map((y, index) => documentToComponent(y, index))}/>
        
        case "box":
            return <DocumentBox key={key} children={x.content.map((y, index) => documentToComponent(y, index))}/>
        
        case "image":
            return <DocumentImage key={key} args={x.args}/>

        case "link-content":
            return <DocumentLinkContent key={key} args={x.args}/>

        case "header2":
            return <DocumentHeader2 key={key} children={x.content}/>

        case "header3":
            return <DocumentHeader3 key={key} children={x.content}/>
                
        case "header4":
            return <DocumentHeader4 key={key} children={x.content}/>

        default:
            return x;
    }
}

export default DocumentRender;