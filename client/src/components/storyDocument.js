import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Server from '../server/server';
import '../styles/story.css';
import '../styles/text.css';

const StoryDocument = ({ id }) => 
{
    /** @type {[document: StoryDocumentDB, setDocument: React.Dispatch<React.SetStateAction<StoryDocumentDB>>]} */
    const [loaded, setLoaded] = useState(false);
    const [editEnabled, setEditEnabled] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [text, setText] = useState("");

    useEffect(() => 
    {
        setLoaded(false);

        if (id)
        {   
            Server.documents.get(id)
            .then((response) => response && setText(response.result.data))
            .finally(() => setLoaded(true))
            .catch(console.error());
        }
    }, [id]);
    
    useEffect(() => 
    {
        // Automatically update database
        if (!isSaving && id && loaded)
        {
            setIsSaving(true);
            Server.documents.update(id, text)
            .catch(console.error())
            .finally(() => setIsSaving(false));
        }
    }, [text])

    return (
        <div className="storyDocument">
            { loaded && ( editEnabled ?
                <CKEditor
                    editor={ ClassicEditor }
                    data={text}
                    config={{
                        //toolbar: ['heading', '|', 'bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote']
                    }}
                    onChange={(_, editor) => setText(editor.getData())}
                />
                :
                <div
                    className="storyDocumentInner"
                    dangerouslySetInnerHTML={{__html: text}}
                />
            )}
        </div>
    );
}

export default StoryDocument;