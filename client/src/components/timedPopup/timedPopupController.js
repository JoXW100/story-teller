import React, { useContext, useEffect, useReducer } from 'react';
import TimedPopup from './timedPopup';
import { Context } from '../appContext';
import '../../styles/timedPopup.css';

/**
 * @typedef PopupContext
 * @type {[ popup: { addPopup: (content, duration: Number) => void} ]}
 */

/** @type {React.Context<PopupContext>} */
export const PopupContext = React.createContext([]);

export const TimedPopupController = ({ children }) => 
{
    const [_1, _2, history] = useContext(Context);

    const reducer = (state, action) => 
    {
        let time = Date.now();
        switch(action.type)
        {
            case 'add':
                history.set({ ...history.value, [time]: action.content });
                return [
                    ...state, 
                    {
                        startTime: time,
                        duration: action.duration, 
                        content: action.content
                    }
                ]
            
            case 'del':
                return state.filter((popup) => popup.startTime + 1000 * popup.duration > time 
                                            && popup.startTime !== action.time)
            
            case 'update':
                return state.filter((popup) => popup.startTime + 1000 * popup.duration > time)

            default:
                return state;
        }
    }
    
    const [state, dispatch] = useReducer(reducer, []);

    useEffect(() => 
    {
        let id = setInterval(() => dispatch({ type: 'update' }, 1000));
        return () => clearInterval(id);
    }, []);

    return  (
        <PopupContext.Provider
            value={[{ addPopup: (content, duration) => dispatch({ type: 'add', content: content, duration: duration})}]}
        >
            <div className="timedPopupController">
                {state.map((_, index) => 
                    <TimedPopup 
                        key = {index}
                        duration = {state[state.length - 1 - index].duration}
                        startTime = {state[state.length - 1 - index].startTime}
                        onDone = {(time) => dispatch({ type: 'del', time: time})}
                    >
                        {state[state.length - 1 - index].content}
                    </TimedPopup>
                )}
            </div>
            {children}
        </PopupContext.Provider>
    );
}
