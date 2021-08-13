import React, { useEffect, useRef, useState } from 'react';
import Server from '../server/server';
import "../styles/document.css";

/**
 * 
 * @param {{ document: StoryDocument }} 
 * @returns 
 */
const DocumentEdit = ({ document, onChange }) => 
{
    const [name, setName] = useState(document.data.name);
    const [short, setShort] = useState(document.data.short);
    const [title, setTitle] = useState(document.data.title);
    const [body, setBody] = useState(document.data.body);
    const [isSaving, setIsSaving]  = useState(false);
    const [savingQueue, setSavingQueue] = useState(false);

    const save = async () => 
    {
        if (isSaving)
        {
            setSavingQueue(true);
            return false;
        }
        else
        {
            let data = { name: name, short: short, title: title, body: body }
            let response = await Server.documents.update(document._id, data);
            setIsSaving(false);
            if (!response) console.log("Failed Saving");
            if (savingQueue)
            {
                setSavingQueue(false);
                return await save();
            }

            onChange();
            return true;
        }
    }

    useEffect(() => 
    {
        setName(document.data.name);
        setShort(document.data.short);
        setTitle(document.data.title);
        setBody(document.data.body);
    }, [document]);

    useEffect(save, [name, short, title, body]);

    return (
        <div className="editBackground">
            <SectionGroup text={"Data"}>
                <InputSection 
                    text={"Name"} 
                    value={name} 
                    setValue={setName} 
                />
                <InputSection 
                    text={"Short"} 
                    value={short} 
                    setValue={setShort} 
                    multiline={true}
                />
            </SectionGroup>
            <SectionGroup text={"Text"} fillScreen={true}>
                <InputSection 
                    text={"Header"} 
                    value={title} 
                    setValue={setTitle}
                />
                <InputSection
                    text={"Body"} 
                    value={body} 
                    setValue={setBody} 
                    multiline={true}
                    fillScreen={true}
                />
            </SectionGroup> 
        </div>
    );
}

const InputSection = ({ text, value, setValue, multiline=false, fillScreen=false}) => 
{
    const ref = useRef();

    const handleTab = (e) => 
    {
        //e.preventDefault();
        //let start = ref.current.selectionStart;
        //let end = ref.current.selectionEnd;
        //setValue(`${value.substring(0, start)}\t${value.substring(end)}`);
        //ref.current.selectionStart = ref.current.selectionEnd = start + 1;
    }

    return (
        <div className={fillScreen ? "inputSection fill" : "inputSection"}>
            <div className="inputSectionText"> {text} </div>
            { multiline ?
                <textarea
                    ref={ref}
                    className="inputSectionInput"
                    spellCheck={true}
                    lang="en"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Tab" && handleTab(e)}
                />
                :
                <input
                    ref={ref}
                    className={"inputSectionInput"}
                    spellCheck={true}
                    lang="en"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            }
        </div>
    )
}

const SectionGroup = ({ text, children, fillScreen=false }) => 
{
    const [open, setOpen] = useState(true);
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

export default DocumentEdit;