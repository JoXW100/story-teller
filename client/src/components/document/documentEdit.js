import React, { useState, useEffect } from 'react';
import CreEditor from './editors/creEditor';
import DocEditor from './editors/docEditor';
import AbiEditor from './editors/abiEditor';
import "../../styles/document.css";
import Server from '../../server/server';

/**
 * 
 * @param {{ document: DBFile }} 
 * @returns 
 */
const DocumentEdit = ({ document, onChange }) => 
{
    const [state, setState] = useState({ loading: false, content: null });

    const generateDocument = () => 
    {
        switch (document.type) {
            case "cre":
                return <CreEditor document={document} onChange={onChange}/>;
        
            case "abi":
                return <AbiEditor document={document} onChange={onChange}/>

            default:
                return <DocEditor document={document} onChange={onChange}/>;
        }
    }

    useEffect(() => setState({ loading: false, content: generateDocument() }), [document]);
    
    return state.loading ? null: state.content;
}

export default DocumentEdit;