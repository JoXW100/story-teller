import React, { useEffect, useState } from 'react';
import DocumentEditFileSection from '../documentComponents/documentEditFileSection';
import DocumentEditGroupSection from '../documentComponents/documentEditGroupSection';
import DocumentEditInputSection from '../documentComponents/documentEditInputSection';

/**
 * @param {{ document: DBFile, save: (update: Object<string, *>, callback: (response: {}) => void) => void}} 
 * @returns {React.Component}
 */
const DocEditor = ({ document, save }) => 
{
    /** 
     * @type {[ 
     *  state: { 
     *      content: DBDocumentFileContent, 
     *      loading: boolean
     *  }, setState: () => void]} 
     * 
    */
    const [state, setState] = useState({ 
        content: document.content,
        loading: true
    });

    useEffect(() => 
    {
        setState({ 
            content: document.content, 
            loading: true
        });
    }, [document]);

    useEffect(() => 
    {
        if (state.loading) setState({ ...state, loading: false });
        else save({ content: state.content });
    }, [state.content]);

    return (
        <div className="editBackground">
            <DocumentEditGroupSection text="Data">
                <DocumentEditInputSection 
                    text="Short"
                    value={state.content.shortText} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, shortText: x }})} 
                    multiline={true}
                />
                <DocumentEditFileSection
                    documentID={document._id}
                    text="images"
                />
            </DocumentEditGroupSection>

            <DocumentEditGroupSection text="Text" fillScreen={true}>
                <DocumentEditInputSection 
                    text="Header"
                    value={state.content.title} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, title: x }})}
                />
                <DocumentEditInputSection
                    text="Text" 
                    value={state.content.text} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, text: x }})} 
                    multiline={true}
                    fillScreen={true}
                />
            </DocumentEditGroupSection> 
        </div>
    );
}

export default DocEditor;