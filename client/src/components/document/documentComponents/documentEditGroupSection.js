import React, { useRef, useState } from 'react';

/**
 * @param {{ children: [React.Component], text: string, fillScreen: boolean }} 
 * @returns {React.Component}
 */
const DocumentEditGroupSection = ({ children, text, fillScreen = false }) => 
{
    const [open, setOpen] = useState(fillScreen);
    const ref = useRef();

    return (
        <div className={fillScreen && open ? "groupSection fill" : "groupSection"}>
            <div
                ref={ref}
                className={"inputSectionText expand"}
                onClick={(e) => e.target === ref.current && setOpen(!open)}
            > 
                {text} 
            </div>
            { open && children}
        </div>
    )
}

export default DocumentEditGroupSection;