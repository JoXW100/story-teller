import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { Context } from '../appContext';
import Server from '../../server/server';
import "../../styles/document.css";

/**
 * 
 * @param {{ document: DBFile }} 
 * @returns 
 */
const DocumentEdit = ({ document, onChange }) => 
{
    const [short, setShort] = useState(document.content.shortText);
    const [title, setTitle] = useState(document.content.title);
    const [body, setBody] = useState(document.content.text);
    const [isSaving, setIsSaving] = useState(false);
    const [savingQueue, setSavingQueue] = useState(false);

    useEffect(() => 
    {
        setShort(document.content.shortText);
        setTitle(document.content.title);
        setBody(document.content.text);
        setSavingQueue(false);
        setIsSaving(false);
    }, [document])
    
    useEffect(() => 
    {
        const save = (override = false) => 
        {
            console.log("save...");
            if (isSaving)
            {
                setSavingQueue(!override);
            }
            if (!isSaving || override)
            {
                let update = {
                    ["content.shortText"]: short,
                    ["content.title"]: title,
                    ["content.text"]: body
                }
                Server.files.update(document._id, update)
                .catch(console.error())
                .finally(() => (savingQueue && save(override = true) & setIsSaving(false)))
                .then((response) => {
                    if (!response) console.error("Failed Saving");
                    if (savingQueue)
                    {
                        setSavingQueue(false);
                        save();
                    }
                    onChange();
                });
            }
        }
        save();
    }, [short, title, body]);

    return (
        <div className="editBackground">
            <GroupSection text="Data">
                <InputSection 
                    text="Short"
                    value={short} 
                    setValue={setShort} 
                    multiline={true}
                />
                <FileSection
                    documentID={document._id}
                    text="images"
                />
            </GroupSection>
            <GroupSection text="Text" fillScreen={true}>
                <InputSection 
                    text="Header"
                    value={title} 
                    setValue={setTitle}
                />
                <InputSection
                    text="Body" 
                    value={body} 
                    setValue={setBody} 
                    multiline={true}
                    fillScreen={true}
                />
            </GroupSection> 
        </div>
    );
}

/**
 * 
 * @param {{ text: string, value: string, setValue: (value: string) => void, multiline: boolean, fillScreen: boolean }} 
 * @returns {React.Component}
 */
const InputSection = ({ text, value, setValue, multiline=false, fillScreen=false}) => 
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
                    onChange={(e) => setValue(e.target.value)}
                />
            }
        </div>
    )
}

/**
 * 
 * @param {{ children: [React.Component], text: string, fillScreen: boolean }} 
 * @returns {React.Component}
 */
const GroupSection = ({ children, text, fillScreen=false }) => 
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

/**
 * 
 * @param {{ documentID: ObjectID, text: string, setImages: ([DBAsset]) => void, removeImage: (index: number) => void }} 
 * @returns {React.Component}
 */
const FileSection = ({ documentID, text }) => 
{
    const ref = useRef();
    const [files, setFiles] = useState([]);

    const refresh = () => Server.assets.getRelated(documentID)
        .then((response) => response && setFiles(response.result))
        .catch(console.error());

    useEffect(refresh, [documentID])
    
    /** @param {React.ChangeEvent<HTMLInputElement>} e */
    const handleFileChanged = (e) => 
    {
        Server.assets.add(e.target.files[0], documentID, "image", "")
        .then((response) => response && refresh())
        .catch(console.error());
    }

    return (
        <div className="inputSection">
            <div className="inputSectionText"> {text} </div>
            <div className="fileSection">
                {files?.map((asset, index) => (
                    <FileSectionItem key={index} asset={asset} refresh={refresh}/>
                ))}
                <div className="fileSectionItemInput" onClick={() => ref.current.click()}> + Add File</div>
                <input ref={ref} type="file" onChange={handleFileChanged}/>
            </div>
        </div>
    );
}

/**
 * 
 * @param {{ asset: DBAsset, refresh: () => void }} 
 * @returns {React.Component}
 */
const FileSectionItem = ({ asset, refresh }) => 
{
    const [_, menu] = useContext(Context);
    const download = useRef();

    const handleRemove = () => {
        Server.assets.remove(asset._id)
        .then((response) => response && refresh())
        .catch(console.error());
    }

    const handleCopyID = () => navigator.clipboard.writeText(asset.assetFileID);

    const handleDownload =() => 
    {
        Server.assets.getFile(asset.assetFileID)
        .then((response) => {
            if (response)
            {
                download.current.href = URL.createObjectURL(response);
                download.current.click();
            }
        })
        .catch(console.error());
    };

    const onContextMenu = (e) => 
    {
        e.preventDefault();
        menu.set({ active: true, x: e.pageX, y: e.pageY, options: 
            [
                { name: "Remove",   action: handleRemove },
                { name: "Copy ID",  action: handleCopyID },
                { name: "Download", action: handleDownload }
            ]});
    }

    return (
        <div 
            className="fileSectionItem"
            onContextMenu={onContextMenu}
        >
            {asset ? asset.name : ""}
            <a ref={download} download={asset ? asset.name : ""}/>
        </div>
    );
}

export default DocumentEdit;