import React from 'react';

/**
 * 
 * @param {{ text: string, value: string, setValue: (value: string) => void, type: string, multiline: boolean, fillScreen: boolean }} 
 * @returns {React.Component}
 */
const DocumentEditInputSection = ({ text, value, setValue, type="text", multiline=false, fillScreen=false}) => 
{
    return (
        <div className={fillScreen ? "inputSection fill" : "inputSection"}>
            <div className="inputSectionText"> {text} </div>
            { multiline ?
                <textarea
                    className="inputSectionInput"
                    spellCheck={true}
                    lang="en"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                :
                <input
                    className={"inputSectionInput"}
                    spellCheck={true}
                    lang="en"
                    value={value}
                    type={type}
                    onChange={(e) => setValue(e.target.value)}
                />
            }
        </div>
    )
}

export default DocumentEditInputSection;