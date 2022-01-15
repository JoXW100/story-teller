import React, { useReducer } from 'react';
import ContextMenu from './contextMenu';
import TimedPopupController from './timedPopupController';
import '../@types';

/**
 * @typedef DataJSON
 * @property {{ lastStory: string, folders: string }} storageKeys
 * @property {number} folderDuration
 */
 /**
 * @typedef PopupHistoryElement
 * @property {number} time
 * @property {React.Component} content
 */

/**
 * @typedef PopupElement
 * @property {number} time
 * @property {number} endTime
 * @property {React.Component} content
 */

/**
 * @typedef AppDispatch
 * @property {string} type
 */

/**
 * @typedef ContextMenuParams
 * @type {{ active: boolean, coords: { x: number, y: number}, options: [{ name: string, action: () => void }]}}
 */

/**
 * @typedef AppState
 * @property {DataJSON} data
 * @property {[PopupHistoryElement]} history
 * @property {[PopupElement]} popups
 * @property {ContextMenuParams} menu
 */

/**
 * @typedef CoordinatePair
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef AppContextData
 * @property {DataJSON} data
 * @property {[PopupHistoryElement]} popupHistory
 * @property {{ add: (value: *) => void, get: [PopupElement] }} popups
 * @property {{ show: (coords: CoordinatePair, options: [{ name: string, action: () => void }]) => void, hide: () => void}} menu
 */

/** @type {React.Context<AppContextData>} */
export const Context = React.createContext({});

export const AppContext = ({ children }) => 
{
    /**
     * @param {AppState} state 
     * @param {AppDispatch} action 
     * @returns {AppState}
     */
    const reducer = (state, action) => 
    {
        let time = Date.now();
        switch(action.type)
        {
            case 'addPopup':
                return {
                    ...state,
                    history: [ ...(state.history), { time: time, content: action.content }], 
                    popups: [ ...(state.popups), { time: time, endTime: time + action.duration * 1000,  content: action.content}]
                };
            
            case 'updatePopups':
                return { ...state, popups: state.popups.filter((popup) => popup.endTime > time)};
            
            case 'showMenu':
                return { ...state, menu: { active: true, coords: action.coords, options: action.options }};

            case 'hideMenu':
                return { ...state, menu: { ...state.menu, active: false }}

            default:
                return state;
        }
    }
    
    /** @type {[state: AppState, dispatch: React.Dispatch<AppDispatch>]} */
    const [state, dispatch] = useReducer(reducer, {
        history: [], 
        popups: [], 
        menu: { active: false, coords: { x: 0, y: 0 }, options: []}
    });

    return (
        <Context.Provider value={{
            data: require("../data/data.json"),
            popupHistory: state.history,
            popups: { 
                add: (value) => dispatch({ type: "addPopup", content: value, duration: 4 }), 
                get: state.popups 
            },
            menu: { 
                show: (coords, options) => dispatch({ type: "showMenu", coords: coords, options: options }),
                hide: () => dispatch({ type: "hideMenu" })
            }
        }}>
            <ContextMenu state={state.menu} hide={() => dispatch({ type: "hideMenu" })}/>
            <TimedPopupController state={state.popups} dispatch={dispatch}/>
            { children }
        </Context.Provider>
    );
}