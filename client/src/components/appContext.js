import React from 'react';
import ContextMenu from './contextMenu';
import '../@types';

/**
 * @typedef DataJSON
 * @property {{ lastStory: String }} storageKeys
 */

/**
 * @typedef DataState
 * @property {DataJSON} value
 * @property {React.Dispatch<React.SetStateAction<DataJSON>>} set
 */

/**
 * @typedef MenuState
 * @property {ContextMenuParams} value
 * @property {React.Dispatch<React.SetStateAction<ContextMenuParams>>} set
 */

/**
 * @typedef Context
 * @type {[ data: DataState, story: MenuState ]}
 */

/** @type {React.Context<Context>} */
export const Context = React.createContext([]);

export const AppContext = ({ children }) => {

    const [data, setData] = React.useState(require("../data/data.json"));
    const [menu, setMenu] = React.useState({ active: false, x: 0, y: 0, options: []});

    return (
        <Context.Provider value={[{ value: data, set: setData }, { value: menu, set: setMenu }]}>
            <ContextMenu state={menu} setState={setMenu}/>
            { children }
        </Context.Provider>
    );
}