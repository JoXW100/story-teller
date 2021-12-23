import React, { useEffect, useState } from 'react';
import Server from '../../../server/server';
import DocumentEditFileSection from '../documentComponents/documentEditFileSection';
import DocumentEditGroupSection from '../documentComponents/documentEditGroupSection';
import DocumentEditInputSection from '../documentComponents/documentEditInputSection';

/**
 * 
 * @param {{ document: DBFile }} 
 * @returns 
 */
const DocEditor = ({ document, onChange }) => 
{
    /** 
     * @type {[ 
     *  state: { 
     *      content: DBDocumentFileContent, 
     *      isSaving: boolean, 
     *      isQueued: boolean
     *  }, setState: () => void]} 
     * 
    */
    const [state, setState] = useState({ 
        content: { 
            shortText: document.content.shortText,
            title: document.content.title,
            text: document.content.text
        },
        loading: true,
        isSaving: false,
        isQueued: false
    });
    
    const save = (override = false) => 
    {
        if (state.isSaving && !override) 
        {
            if (!state.isQueued) setState({ ...state, isQueued: true });
        }
        else
        {
            let update = {
                ["content.shortText"]: state.content.shortText,
                ["content.title"]: state.content.title,
                ["content.text"]: state.content.text
            }
            Server.files.update(document._id, update)
            .catch(console.error())
            .then((response) => {
                if (!response) console.error("Failed Saving");
                
                if (state.isQueued && !override)
                {
                    setState({ ...state, isSaving: false, isQueued: false });
                    save(true);
                }
                else
                {
                    setState({ ...state, isSaving: false });
                    onChange();
                }
            });
        }
    }

    useEffect(() => 
    {
        setState({ 
            content: { 
                shortText: document.content.shortText, 
                title: document.content.title, 
                text: document.content.text 
            }, 
            loading: true,
            isSaving: false,
            isQueued: false
        });
    }, [document]);

    useEffect(() => 
    {
        if (state.loading) setState({ ...state, loading: false });
        else save();
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