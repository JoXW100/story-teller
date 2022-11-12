import React, { useEffect } from 'react';
import DocumentParser from '../../../classes/documentParser';

/**
 * 
 * @param {{ doc: DBFile }} 
 * @returns {React.Component}
 */
const DocRenderer = ({ doc }) => 
{
    useEffect(() =>
    {
        if (doc.content?.title) document.title = doc.content.title;
    }, [doc]);

    return (
        <div className="documentBackground">
            <div className={"documentTitle"}> {doc.content.title} </div>
            <div className={"documentBody"}> 
                {DocumentParser.parse(doc.content.text)} 
            </div>
        </div>
    );
}

export default DocRenderer;