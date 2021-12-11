import React, { useContext } from 'react';
import { Context } from './appContext';
import '../styles/historyMenu.css';

const HistoryMenu = () => 
{
    const [_1, _2, history] = useContext(Context);

    return (
        <div className="historyMenu">
            {Object.keys(history.value)
                   .sort((a, b) => parseInt(b) - parseInt(a))
                   .map((key) => <HistoryEntry> {history.value[key]} </HistoryEntry>)}
        </div>
    );
}

const HistoryEntry = ({ children }) => 
{
    return (
        <div className="historyEntry">
            {children}
        </div>
    );
}

export default HistoryMenu;