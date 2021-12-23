import React, { useContext, useEffect, useRef, useState } from 'react';
import File from './file';
import Server from '../../server/server';
import { Context } from '../appContext';
import '../../styles/files.css';

/**
 * @param {{ 
 *      storyID: ObjectID,
 *      navigate: (id: ObjectID) => Promise<void>,
 *      selected: ObjectID
 * }}
 * @returns {React.Component}
 */
const FileSystem = ({ storyID, navigate, selected }) => 
{
    const [state, setState] = useState({ loading: true, files: []});
    const { menu } = useContext(Context);

    const reload = () => {
        setState({ ...state, loading: true });
        getChildFiles(storyID, (response) => response && setState({ loading: false, files: response.result}));
    }

    useEffect(reload, [storyID])

    const contextMenu = (e) => 
    {
        e.preventDefault();
        if(e.currentTarget !== e.target ) return;
        menu.show({ x: e.pageX, y: e.pageY}, [
            { name: "Add folder",   action: () => addFile(storyID, storyID, "folder", reload)},
            { name: "Add document", action: () => addFile(storyID, storyID, "doc", reload)},
            { name: "Add creature", action: () => addFile(storyID, storyID, "cre", reload)},
            { name: "Add ability",  action: () => addFile(storyID, storyID, "abi", reload)}
        ]);
    }

    const allowDrop = (e) =>
    {
        e.preventDefault();
    }

    const drop = (e) =>
    {
        e.preventDefault();
        if(e.currentTarget !== e.target ) return;
        moveFile(window.dragData["data"].object, storyID, reload);
    }

    return state.loading ? null : (
        <div
            id={"fileMenu"}
            className="fileMenu"
            onContextMenu={contextMenu}
            onDragOver={allowDrop}
            onDrop={drop}
        >
            <div className="storyMenuHeader"> Files </div>
            { state.files.sort(fileSort).map((file, index) =>
                <File
                    key={file.name + state.files.length + index}
                    data={file}
                    storyID={storyID}
                    navigate={navigate}
                    selected={selected}
                    reloadParent={reload}
                />
            )}
        </div>
    );
}

export const fileSort = (a, b) => 
{
    if (a.type === "folder")
    {
        if (b.type === "folder") return a.name.localeCompare(b.name);
        return -1000;
    }
    if (b.type === "folder") return 1000;
    return a.name.localeCompare(b.name);
}

export const addFile = (storyID, holderID, type, then) => 
{
    let content;
    let name;
    switch (type) 
    {
        case "doc":
            name = "newDocument";
            content = { 
                text: "The document body", 
                title: "New Document",
                shortText: "a small description"
            }
            break;

        case "folder":
            name = "newFolder";
            content = {}
            break;

        case "cre":
            name = "newCreature";
            content = {
                name: "A Creature",
                shortText: "description",
                text: "full text",
                type: "none",
                size: "none",
                alignment: "none",
                portraitID: null,
                stats: {
                    level: 0,
                    hitDice: 0,
                    armor: 0,
                    attributes: {
                        str: 10,
                        dex: 10,
                        con: 10,
                        int: 10,
                        wis: 10,
                        cha: 10
                    },
                    savingThrows: {
                        str: 0,
                        dex: 0,
                        con: 0,
                        int: 0,
                        wis: 0,
                        cha: 0
                    },
                    speed: {
                        walk: 0,
                        swim: 0,
                        fly: 0,
                        burrow: 0
                    },
                    senses: [],
                    languages: [],
                    resistances: [],
                    immunities: [],
                    advantages: [],
                    disadvantages: [],
                    challenge : "none"
                },
                abilities: [],
                spells: {
                    casterType: "none",
                    spellSlots: [],
                    spellIDs: []
                }
            }
            break;
        
        case "abi":
            name = "newAbility";
            content = {
                name: "An Ability",
                shortText: "description",
                text: "full text",
                notes: "-",
                abilityType: "none",
                actionType: "special",
                charges: -1,
                chargeReset: "none",
                roll: {
                    scalingModifier: "none",
                    proficiency: 0,
                    baseModifier: 0,
                    diceSize: 20,
                    diceNum: 1
                },
                effect: {
                    type: "none",
                    range: "0 ft",
                    successEffect: "-",
                    failEffect: "-",
                    roll: {
                        scalingModifier: "none",
                        proficiency: 0,
                        baseModifier: 0,
                        diceSize: 20,
                        diceNum: 1
                    }
                }
            }
            break;

        default:
            console.error("Unknown filetype:", type);
            return;
    }

    Server.files.add(storyID, holderID, name, type, content)
        .catch(console.error())
        .then(then);
}

export const removeFile = (fileID, then) => 
{
    Server.files.remove(fileID)
    .catch(console.error())
    .then(then);
}

export const renameFile = (fileID, name, then) => 
{
    Server.files.update(fileID, { name: name })
    .catch(console.error())
    .then(then);
}

export const setDefaultFile = (storyID, fileID, then) => 
{
    Server.stories.update(storyID, { defaultDocument: fileID })
    .catch(console.error())
    .then(then);
}

export const moveFile = (file, parentID, then) => 
{
    if (file.holderID === parentID) return;
    Server.files.update(file._id, { holderID: parentID })
    .catch(console.error())
    .then(then);
}

export const getChildFiles = (fileID, then) => 
{
    Server.files.getAllChildren(fileID)
    .catch(console.error())
    .then(then);
}

export const getFileArray = (fileIDs, then) => 
{
    let promises = new Array(fileIDs.length)
    for (let index = 0; index < promises.length; index++) 
    {
        promises[index] = Server.files.get(fileIDs[index]);
    }

    Promise.all(promises)
    .catch(console.error())
    .then((responses) => then(
        { result: responses.reduce((files, response) => response 
            ? { successful: files.successful, result: [...(files.result), response.result] }
            : { successful: false, result: files.result }, 
        { successful: true, result: [] })}));
}

export default FileSystem;