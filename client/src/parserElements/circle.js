import React, { useEffect, useRef, useState } from 'react';
import DocumentFunctions from '../classes/documentFunctions';
import "../styles/document.css";

export const toCircleDictionary = (index) => ({
    "<circle>": { 
        cmp: index,  
        type: "circle", 
        toComponent: (content, index) => (
            <DocumentCircle 
                key={index} 
                content={content}
                args={DocumentFunctions.contentToArgs(content, 'size')}
            />
        )
    },
    "</circle>": { 
        cmp: -index 
    }
});

const DocumentCircle = ({ content, args }) => 
{
    const [size, setSize] = useState(null);

    /** @type {React.Ref<HTMLHeadingElement>} */
    const ref = useRef();

    useEffect(() => 
    {
        if (args.size) setSize(args.size);
    }, [args])

    useEffect(() => 
    {
        if (ref.current && !size)
        {
            let value = Math.max(ref.current.offsetWidth, ref.current.offsetHeight);
            ref.current.style.width  = `${value}px`;
            ref.current.style.height = `${value}px`;
        }
    }, [ref.current, size])

    return (
        <div 
            ref={ref} 
            className="documentCircle"
            style={size ? {width: size, height: size} : {}}
        > 
            {content} 
        </div>
    )
}

export default DocumentCircle;