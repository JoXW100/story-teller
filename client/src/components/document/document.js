import React, { useEffect, useState } from 'react';
import DocumentEdit from './documentEdit';
import DocumentRender from './documentRender';
import Server from '../../server/server';
import "../../styles/document.css";

const Document = ({ id, editEnabled }) => 
{
    const [state, setState] = useState({ loading: true, document: null, preview: null });

    const onChange = () => 
    {
        Server.files.get(id)
        .then((response) => response && setState({ ...state, preview: response.result }))
        .catch(console.error());
    };

    useEffect(() => 
    {
        Server.files.get(id)
        .then((response) => response && setState({ loading: false, document: response.result, preview: response.result }))
        .catch(console.error());
    }, [id])

    return state.loading ? null : (editEnabled ? 
        <div className="documentSlideGroup">
            <DocumentEdit document={state.document} onChange={onChange}/>
            <div className="documentSlideHandle"/>
            <DocumentRender document={state.preview}/>
        </div>
        : 
        <div className="documentCenter">
            <DocumentRender document={state.document}/> 
        </div>
    );
}

export default Document;