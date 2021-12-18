import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Context } from './appContext';
import Server from '../server/server';
import Document from './document/document';
import FileSystem from './fileSystem/fileSystem';
import DiceMenu from './diceMenu/diceMenu';
import HistoryMenu from './historyMenu';
import '../styles/story.css';

/**
 * 
 * @param {{ history: any, match: any }} 
 * @returns {React.Component}
 */
const StoryMenu = ({ history, match }) => 
{
    const [data] = useContext(Context);
    const [story, setStory] = useState(undefined);
    const [showDiceMenu, setShowDiceMenu] = useState(false);
    const [showHistoryMenu, setShowHistoryMenu] = useState(false);
    const inEditMode = match.params.editMode === "editMode=true";

    const navigate = async (documentKey, editMode) => 
    {
        let mode = editMode === undefined ? inEditMode : editMode;
        history.push(`/stories/${match.params.key}/${documentKey}/editMode=${mode}`);
    }

    const getSelected = () => match.params.doc;

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
                setStory(response.result);
                if (!match.params.doc && response.result.defaultDocument) 
                    navigate(response.result.defaultDocument);
            }
        })
        .catch(console.error());
        
    }, []);

    return (
        <div className="storyHolder">
            <FileSystem
                storyID={story?._id}
                navigate={navigate}
                getSelected={getSelected}
            />
            <div className="storyBody">
                <div className="storyTitle"> 
                    <div className="storyTitleButtonGroup">
                        <div 
                            className={"storyTitleButton Dice"}
                            onClick={() => setShowDiceMenu(!showDiceMenu)}
                        >
                            {"Dice"}
                        </div>
                        <div 
                            className={"storyTitleButton History"}
                            onClick={() => setShowHistoryMenu(!showHistoryMenu)}
                        >
                            {"History"}
                        </div>
                    </div>
                    <div className="storyTitleText"> {story && story.name} </div>
                    <div 
                        className={"storyTitleButton Edit"}
                        onClick={() => navigate(match.params.doc, !inEditMode)}
                    >
                        {inEditMode ? "Done" : "Edit"}
                    </div>
                </div>
                <Document id={match.params.doc} editEnabled={inEditMode}/>
            </div>
            { showDiceMenu    && <DiceMenu hide={() => setShowDiceMenu(false)}/>}
            { showHistoryMenu && <HistoryMenu/>}
        </div>
    );
}

export default StoryMenu;