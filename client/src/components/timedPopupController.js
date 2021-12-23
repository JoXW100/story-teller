import React, { useEffect } from 'react';
import '../styles/timedPopup.css';

/**
 * 
 * @param {{ state: import('./appContext').AppState, dispatch: React.Dispatch<import('./appContext').AppDispatch>}} 
 * @returns 
 */
const TimedPopupController = ({ state, dispatch }) => 
{
    useEffect(() => 
    {
        let id = setInterval(() => state.length > 0 && dispatch({ type: 'updatePopups' }), 500);
        return () => clearInterval(id);
    }, [state, dispatch]);

    return  (
        <div className="timedPopupController">
            {state.sort((a, b) => b.time - a.time)
                   .map((popup) => <div key = {popup.time} className="timedPopup"> {popup.content} </div>
            )}
        </div>
    );
}

export default TimedPopupController;