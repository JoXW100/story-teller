import React from 'react';
import DocumentParser from '../../../classes/documentParser';

/**
 * 
 * @param {{ document: DBFile }} 
 * @returns {React.Component}
 */
const DocRenderer = ({ document }) => 
{
    return (
        <div className="documentBackground">
            <div className={"documentTitle"}> {document.content.title} </div>
            <div className={"documentBody"}> 
                {DocumentParser.parse(document.content.text)} 
            </div>
        </div>
    );
}

export default DocRenderer;