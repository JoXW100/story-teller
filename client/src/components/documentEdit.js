import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { Context } from './appContext';
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
    const [images, setImages] = useState(document.data.images);
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
            let data = { name: name, short: short, images: images, title: title, body: body }
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

    const removeImage = (index) => 
    {
        Server.images.remove(images[index])
        .then((response) => response && setImages(images.filter((_, i) => i != index)))
        .catch(console.error());
    }

    useEffect(() => 
    {
        setName(document.data.name);
        setShort(document.data.short);
        setImages(document.data.images);
        setTitle(document.data.title);
        setBody(document.data.body);
    }, [document]);

    useEffect(save, [name, short, images, title, body]);

    return (
        <div className="editBackground">
            <GroupSection text="Data">
                <InputSection 
                    text="Name" 
                    value={name} 
                    setValue={setName} 
                />
                <InputSection 
                    text="Short"
                    value={short} 
                    setValue={setShort} 
                    multiline={true}
                />
                <FileSection
                    text="images"
                    images={images}
                    setImages={setImages}
                    removeImage={removeImage}
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
 * @param {{ text: string, images: [string], setImages: ([images]) => void, removeImage: (index: number) => void }} 
 * @returns {React.Component}
 */
const FileSection = ({ text, images, setImages, removeImage }) => 
{
    const ref = useRef();
    
    /** @param {React.ChangeEvent<HTMLInputElement>} e */
    const handleFileChanged = (e) => 
    {
        console.log(e.target.files[0]);
        Server.images.add(e.target.files[0])
        .then((response) => response && setImages([...images, response.result]))
        .catch(console.error());
    }

    return (
        <div className="inputSection">
            <div className="inputSectionText"> {text} </div>
            <div className="fileSection">
                {images?.map((imageID, index) => (
                    <FileSectionItem key={index} index={index} imageID={imageID} removeImage={removeImage}/>
                ))}
                <div className="fileSectionItemInput" onClick={() => ref.current.click()}> + Add File</div>
                <input ref={ref} type="file" onChange={handleFileChanged}/>
            </div>
        </div>
    );
}

/**
 * 
 * @param {{ imageID: string, index: number, removeImage: (index: number) => void }} 
 * @returns {React.Component}
 */
const FileSectionItem = ({ imageID, index, removeImage }) => 
{
    const [_, menu] = useContext(Context);
    /** @type {[data: ImageInfo, setData: (data: ImageInfo) => void]} */
    const [data, setData] = useState();

    const download = useRef();

    const handleRemove = useCallback(() => removeImage(index), [removeImage, index]);
    const handleCopyID = useCallback(() => navigator.clipboard.writeText(imageID), [imageID]);
    const handleDownload = useCallback(() => 
    {
        Server.images.get(imageID)
        .then((response) => {
            if (response)
            {
                download.current.href = URL.createObjectURL(response);
                download.current.click();
            }
        })
        .catch(console.error());
    }, [imageID]);

    useEffect(() => 
    {
        Server.images.getData(imageID)
        .then((response) => response && setData(response.result))
        .catch(console.error());
    }, [imageID]);

    const onContextMenu = (e) => 
    {
        e.preventDefault();
        menu.set({ active: true, x: e.pageX, y: e.pageY, options: 
            [
                { name: "Remove",  action: handleRemove },
                { name: "Copy ID", action: handleCopyID },
                { name: "Download", action: handleDownload }
            ]});
    }

    return (
        <div 
            className="fileSectionItem"
            onContextMenu={onContextMenu}
        >
            {data ? data.filename : ""}
            <a ref={download} download={data ? data.filename : ""}/>
        </div>
    );
}

export default DocumentEdit;