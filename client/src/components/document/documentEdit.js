import React, { useState, useEffect } from 'react';
import CreEditor from './editors/creEditor';
import DocEditor from './editors/docEditor';
import AbiEditor from './editors/abiEditor';
import SpeEditor from './editors/speEditor';
import Server from '../../server/server';
import "../../styles/document.css";



/**
 * 
 * @param {{ document: DBFile, onChange: () => void }} 
 * @returns 
 */
const DocumentEdit = ({ document, onChange }) => 
{
    const SaveState = {
        Ready: "Ready",
        Saving: "Saving",
        LoadingQueue: "LoadingQueue"
    }

    const [state, setState] = useState({ loading: true, content: null });
    const [saveState, setSaveState] = useState({ value: SaveState.Ready, queue: null })

    const updateDB = (value, callback = undefined) => 
    {
        Server.files.update(document._id, value)
        .catch((reason) =>
        {
            setSaveState({ ...saveState, value: SaveState.Ready });
            console.error(reason)
        })
        .then((response) => 
        {
            if (!response) console.error("Failed Saving", document._id);
            callback && callback(response);
            onChange();
        });
    }

    const save = (update, callback = undefined) => 
    {
        if (!update) return;
        switch (saveState.value)
        {
            case SaveState.Ready:
                setSaveState({ ...saveState, value: SaveState.Saving });
                updateDB(update, (response) => {
                    setSaveState({ ...saveState, value: (saveState.queue ? SaveState.LoadingQueue : SaveState.Ready) });
                    callback && callback(response);
                });
                break;

            case SaveState.LoadingQueue:
                updateDB(update, (response) => {
                    setSaveState({ ...saveState, value: SaveState.Ready, queue: null });
                    callback && callback(response);
                });
                break;

            default:
                if (!saveState.queue) setSaveState({ ...saveState, queue: update })
                callback && callback(null);
                break;
        }
    }

    const generateDocument = () => 
    {
        switch (document.type) {
            case "cre":
                return <CreEditor document={document} save={save}/>;
        
            case "abi":
                return <AbiEditor document={document} save={save}/>
                
            case "spe":
                return <SpeEditor document={document} save={save}/>

            default:
                return <DocEditor document={document} save={save}/>;
        }
    }

    useEffect(() => setState({ loading: false, content: generateDocument() }), [document]);
    
    useEffect(() => 
    {
        if (saveState.value === SaveState.LoadingQueue) save(state.queue)
    }, [saveState.value]);

    return state.loading ? null : state.content;
}

export default DocumentEdit;