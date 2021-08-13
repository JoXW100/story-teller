import React, { Dispatch, SetStateAction } from 'react';
import '../@types';
import ContextMenu from './contextMenu';

/**
 * @typedef DataJSON
 * @property {{ lastStory: String }} storageKeys
 */

/**
 * @typedef DataState
 * @property {DataJSON} value
 * @property {Dispatch<SetStateAction<DataJSON>>} set
 */

/**
 * @typedef MenuState
 * @property {ContextMenuParams} value
 * @property {Dispatch<SetStateAction<ContextMenuParams>>} set
 */

/**
 * @typedef Context
 * @type {[ data: DataState, story: MenuState ]}
 */

/**
 * @typedef ContextMenuParams
 * @type {{ active: boolean, x: number, y:number, options: [{ name: string, action: () => void }]}}
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