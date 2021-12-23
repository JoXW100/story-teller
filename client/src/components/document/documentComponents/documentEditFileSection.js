import React, { useEffect, useRef, useState, } from 'react';
import Server from '../../../server/server';
import DocumentEditFileSectionItem from './documentEditFileSectionItem';

/**
 * 
 * @param {{ 
 *      documentID: ObjectID, 
 *      text: string, 
 *      setValue: (ObjectID) => void
 * }} 
 * @returns {React.Component}
 */
const DocumentEditFileSection = ({ documentID, text, setValue = undefined }) => 
{
    const ref = useRef();
    const [state, setState] = useState({ loading: true, assets: []});

    const refresh = () => Server.assets.getRelated(documentID)
        .then((response) => response && setState({ loading: false, assets: response.result}))
        .catch(console.error());

    useEffect(refresh, [documentID])

    useEffect(() => state.assets.length > 0 && setValue && setValue(state.assets[0]), [state.assets]);
    
    /** @param {React.ChangeEvent<HTMLInputElement>} e */
    const handleFileChanged = (e) => 
    {
        Server.assets.add(e.target.files[0], documentID, "image", "")
        .then((response) => response && refresh())
        .catch(console.error());
    }

    return state.loading ? null : (
        <div className="inputSection">
            <div className="inputSectionText"> {text} </div>
            <div className="fileSection">
                {state.assets.map((asset, index) => (
                    <DocumentEditFileSectionItem 
                        key={index} 
                        asset={asset} 
                        refresh={refresh}
                    />
                ))}
                { (!setValue || state.assets.length < 1) && 
                    <>
                        <div className="fileSectionItemInput" onClick={() => ref.current.click()}> + Add File</div>
                        <input className="hidden" ref={ref} type="file" onChange={handleFileChanged}/>
                    </>
                }
            </div>
        </div>
    );
}
export default DocumentEditFileSection;