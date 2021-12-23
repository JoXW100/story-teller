import React from 'react';
import DocumentArrayInputItem from './documentArrayInputItem';

/**
 * 
 * @param {{
 *      text: string
 *      value: [*]
 *      setValue: ([string]) => void
 *      type: string
 *      defaultValue: string
 * }} 
 * @returns {React.Component}
 */
const DocumentArraySection = ({ text, value, setValue, type="text", defaultValue = "" }) => 
{
    /** @param {React.ChangeEvent<HTMLInputElement>} e */
    const onClick = (_) => value && setValue([ ...value, defaultValue ]);

    return (
        <div className="inputSection">
            <div className="inputSectionText"> {text} </div>
            <div className="fileSection">
                {value && value.map((item, index) => (
                    <DocumentArrayInputItem
                        key={index}
                        type={type}
                        value={item}
                        setValue={(x) => setValue([...value.slice(0, index), x, ...value.slice(index + 1)])}
                        onRemove={()  => setValue([...value.slice(0, index),    ...value.slice(index + 1)])}
                    />
                ))}
                <div className="fileSectionItemInput" onClick={onClick}> 
                    + Add
                </div>
            </div>
        </div>
    );
}
export default DocumentArraySection;