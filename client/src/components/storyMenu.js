import React, { useContext, useEffect, useState } from 'react';
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
    const { data } = useContext(Context);
    const [state, setState] = useState({ loading: true, story: null, showDiceMenu: false, showHistoryMenu: false });
    const inEditMode = match.params.editMode === "editMode=true";

    const navigate = (documentKey, newTab = false, editMode = inEditMode) => 
    {
        let url = "";
        if (!documentKey)
        {
            if (state.story.defaultDocument)
            {
                url = `/stories/${match.params.key}/${state.story.defaultDocument}/editMode=${editMode}`;
            }
            else
            {
                url = `/stories/${match.params.key}`;
            }
        }
        else
        {
            url = `/stories/${match.params.key}/${documentKey}/editMode=${editMode}`;
        }
        
        if (!newTab)
        {
            history.push(url);
        }
        else
        {
            let x = window.location.href.split(/\//);
            let res = window.open(`${x[0]}/${x[1]}/${x[2]}${url}`,'_blank', 'noopener, noreferrer');
            if (res) res.opener = null;
        }
    }

    useEffect(() => 
    {
        // Set most recent
        localStorage.setItem(data.storageKeys.lastStory, match.params.key);

        // Load Story data
        Server.stories.get(match.params.key)
        .then((response) => 
        {
            if (response)
            {
                if (match.params.doc && response.result.defaultDocument)
                {
                    setState({ ...state, loading: false, story: response.result });
                }
                else
                {
                    navigate(response.result.defaultDocument);
                }
            }
        })
        .catch(console.error());
    }, [history, match]);

    return state.loading ? null : (
        <div className="storyHolder">
            <FileSystem
                storyID={state.story._id}
                navigate={navigate}
                selected={match.params.doc}
            />
            <div className="storyBody">
                <div className="storyTitle"> 
                    <div className="storyTitleButtonGroup">
                        <div 
                            className={"storyTitleButton Dice"}
                            onClick={() => setState({ ...state, showDiceMenu: !state.showDiceMenu })}
                        >
                            {"Dice"}
                        </div>
                        <div 
                            className={"storyTitleButton History"}
                            onClick={() => setState({ ...state, showHistoryMenu: !state.showHistoryMenu })}
                        >
                            {"History"}
                        </div>
                    </div>
                    <div className="storyTitleText"> {state.story.name} </div>
                    <div 
                        className={"storyTitleButton Edit"}
                        onClick={() => navigate(match.params.doc, false, !inEditMode)}
                    >
                        {inEditMode ? "Done" : "Edit"}
                    </div>
                </div>
                <Document id={match.params.doc} editEnabled={inEditMode} navigate={navigate}/>
            </div>
            { state.showDiceMenu    && <DiceMenu hide={() => setState({ ...state, showDiceMenu: false })}/>}
            { state.showHistoryMenu && <HistoryMenu/>}
        </div>
    );
}

export default StoryMenu;