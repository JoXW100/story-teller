import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Context } from './appContext';
import Server from '../server/server';
import Document from './document';
import FileSystem from './fileSystem';
import '../styles/story.css';

/**
 * 
 * @param {{ history: any, match: any }} 
 * @returns {React.Component}
 */
const StoryMenu = ({ history, match }) => 
{
    const [data, menu] = useContext(Context);
    /** @type {[story: Story, setStory: React.Dispatch<React.SetStateAction<Story>>]} */
    const [story, setStory] = useState(undefined);
    const inEditMode = match.params.editMode === "editMode=true";

    const navigate = async (documentKey, editMode) => 
    {
        let mode = editMode === undefined ? inEditMode : editMode;
        history.push(`/stories/${match.params.key}/${documentKey}/editMode=${mode}`);
    }

    const reload = async () =>
    {
        Server.stories.get(match.params.key)
        .then((response) => response && setStory(response.result))
        .catch(console.error());
    }

    const onContextMenu = (e) => 
    {
        if (e.target.id === "fileMenu")
        {
            e.preventDefault();
            menu.set({ active: true, x: e.pageX, y: e.pageY, options:
                [
                    { name: "Add folder",   action: handleAddFolder },
                    { name: "Add document", action: handleAddDocument }
                ]
            });
        }
    }

    const allowDrop = (e) =>
    {
        if (e.target.id === "fileMenu") e.preventDefault();
    }

    const drop = (e) =>
    {
        if (e.target.id === "fileMenu")
        {
            e.preventDefault();
            var transfer = window.dragData["data"];
            move(transfer.parent, null, transfer.target);
        }
    }
    
    const removeHelper = async (file) => 
    {
        if (file.filetype !== "folder") return await Server.documents.remove(file.content);
        return await Promise.all(file.content.map(async (file) => removeHelper(file)));
    }

    const findValidName = (name, holder) => 
    {
        let i = 1;
        let result = name;
        while (holder.some((file) => file.name === result)) result = `${name} (${i++})`;
        return result;
    }

    const rename = useCallback(async (parent, target, name) => 
    {
        target.name = findValidName(name, parent ? parent.content : story.files);
        await Server.stories.update(match.params.key, undefined, story.files);
        await reload();

    }, [story, reload]);

    const move = useCallback(async(parent, newParent, target) => 
    {
        let name = parent ? parent.name : null;
        let newName = newParent ? newParent.name : null;
        if (name === newName) return await reload();

        // Add to new Parent
        if (newParent) newParent.content.push(target);
        else story.files.push(target);

        // Remove from old parent
        if (parent) parent.content = parent.content.filter((file) => `${file.name}.${file.filetype}` !== `${target.name}.${target.filetype}`);
        else story.files = story.files.filter((file) => file.name !== target.name);

        console.log(parent);

        await Server.stories.update(match.params.key, undefined, story.files);
        await reload();
    }, [story, reload])

    const remove = useCallback(async (parent, target) => 
    {
        await removeHelper(target);

        if (parent) parent.content = parent.content.filter((file) => `${file.name}.${file.filetype}` !== `${target.name}.${target.filetype}`);
        else story.files = story.files.filter((file) => `${file.name}.${file.filetype}` !== `${target.name}.${target.filetype}`);

        await Server.stories.update(match.params.key, undefined, story.files);

        if (target.content === match.params.doc) navigate(story.introduction.content);
        else await reload();

    }, [match, story, reload]);

    const addFolder = useCallback(async (target) => 
    {
        console.log("addFolder", target);
        let holder = target ? target.content : story.files;
        holder.push({
            name: findValidName("new folder", holder),
            filetype: "folder",
            content: []
        });

        await Server.stories.update(match.params.key, undefined, story.files);
        await reload();
        
    }, [story, reload]);

    const addDocument = useCallback(async (target) => 
    {
        console.log("addDocument", target);
        let holder = target ? target.content : story.files;
        let response = await Server.documents.add();
        if (response)
        {
            holder.push({
                name: findValidName("new document", holder),
                filetype: "doc",
                content: response.result
            });
    
            await Server.stories.update(match.params.key, undefined, story.files);
            await reload();
        }
    }, [story, reload]);
    
    const handleAddFolder   = useCallback(() => addFolder(null),   [addFolder]);
    const handleAddDocument = useCallback(() => addDocument(null), [addDocument]);

    useEffect(() => 
    {
        // Set most recent
        localStorage.setItem(data.value.storageKeys.lastStory, match.params.key);

        // Load Story data
        Server.stories.get(match.params.key)
        .then((response) => 
        {
            if (response)
            {
                setStory(response.result)
                if (!match.params.doc) navigate(response.result.introduction.content);
            }
        })
        .catch(console.error());
        
    }, []);

    return (
        <div className="storyHolder">
            <div 
                id={"fileMenu"}
                className="fileMenu"
                onContextMenu={onContextMenu}
                onDragOver={allowDrop}
                onDrop={drop}
            >
                { story && 
                    <FileSystem 
                        story={story}
                        fileData={{ 
                            nav: navigate,
                            selected: match.params.doc,
                            canEdit: false,
                            move: move,
                            rename: rename,
                            remove: remove,
                            addFolder: addFolder,
                            addDocument: addDocument
                        }}
                    />
                }
            </div>
            <div className="storyBody">
                <div className="storyTitle"> 
                    {story && story.name}
                    <div 
                        className={"storyTitleButton"}
                        onClick={() => navigate(match.params.doc, !inEditMode)}
                    >
                        {inEditMode ? "Done" : "Edit"}
                    </div>
                </div>
                <Document id={match.params.doc} editEnabled={inEditMode}/>
            </div>
        </div>
    );
}

export default StoryMenu;