import React, { useEffect, useRef } from 'react';
import "../../styles/document.css";

export const toCircleDictionary = (index) => ({
    "<circle>": { 
        cmp: index,  
        type: "circle", 
        toComponent: (content, index) => <DocumentCircle key={index} content={content}/>
    },
    "</circle>": { 
        cmp: -index 
    }
});

const DocumentCircle = ({ content }) => 
{
    /** @type {React.Ref<HTMLHeadingElement>} */
    const ref = useRef();

    useEffect(() => 
    {
        if (ref.current)
        {
            let value = Math.max(ref.current.offsetWidth, ref.current.offsetHeight);
            ref.current.style.width  = `${value}px`;
            ref.current.style.height = `${value}px`;
        }
    }, [ref.current])

    return (
        <div ref={ref} className="documentCircle"> 
            {content} 
        </div>
    )
}

export default DocumentCircle;