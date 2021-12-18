import React, { useCallback, useEffect, useState } from 'react';
import DocumentEdit from './documentEdit';
import DocumentRender from './documentRender';
import Server from '../../server/server';
import "../../styles/document.css";

const Document = ({ id, editEnabled }) => 
{
    const [document, setDocument] = useState(undefined);
    const [preview, setPreview] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const onChange = useCallback(() => 
    {
        if (!loading)
        {
            setLoading(true);
            Server.files.get(id)
            .then((response) => response && setPreview(response.result))
            .catch(console.error())
            .finally(() => setLoading(false));
        }
    }, [id, document, loading, setLoading, setPreview]);

    useEffect(() => 
    {
        if (id) Server.files.get(id)
        .then((response) => response && setDocument(response.result) && setPreview(response.result))
        .catch(console.error());
    }, [id, editEnabled])

    return (
        <>
            { document && 
                ( editEnabled ? 
                    <div className="documentSlideGroup">
                        <DocumentEdit document={document} onChange={onChange}/>
                        <div className="documentSlideHandle"/>
                        <DocumentRender document={preview}/>
                    </div>
                    : 
                    <div className="documentCenter"> 
                        <DocumentRender document={document}/> 
                    </div>
            )}
        </>
    );
}

export default Document;