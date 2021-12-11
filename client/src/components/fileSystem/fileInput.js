import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../../styles/files.css';

/**
 * 
 * @param {{initialTest: string, setTyping: React.Dispatch<React.SetStateAction<boolean>>, done: (name: string) => void}} param0 
 * @returns {React.Component}
 */
const FileInput = ({ initialText, setTyping, done }) => 
{
    const [text, setText] = useState(initialText);
    const ref = useRef();

    const clickHandler = useCallback((e) => e.target !== ref.current && setTyping(false));


    useEffect(() => 
    {
        ref.current.focus();
    })

    useEffect(() => 
    {
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    }, []);

    return (
        <input
            ref={ref}
            id={"fileRenameInput"}
            className={"file input"} 
            value={text}
            onChange={(e) => setText(e.target.value)}
            onContextMenu={(e) => e.preventDefault()}
            onKeyPress={(e) => e.key === "Enter" && done(text)}
            autoComplete="off"
        />
    );
}

export default FileInput;