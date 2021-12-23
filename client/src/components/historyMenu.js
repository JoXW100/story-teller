import React, { useContext } from 'react';
import '../styles/historyMenu.css';
import { Context } from './appContext';

const HistoryMenu = () => 
{
    const { popupHistory } = useContext(Context);

    return (
        <div className="historyMenu">
            { popupHistory.sort((a, b) => b.time - a.time)
                .map((entry) => <HistoryEntry key={entry.time} content={entry.content}/>)
            }
        </div>
    );
}

const HistoryEntry = ({ content }) => 
{
    return (
        <div className="historyEntry">
            {content}
        </div>
    );
}

export default HistoryMenu;