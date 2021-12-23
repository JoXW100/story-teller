import React from 'react';
import * as Dictionaries from '../components/documentDictionaries/index';

/**
 * @typedef PartStackElement
 * @property {number} cmp Compare value
 * @property {string} type The element type
 * @property {(children: [React.Component]) => React.Component} toComponent Component translation function
 * @property {[PartStackElement]} content Stack holding subElements before translation
 */

/**
 * Class Handling paring of text into react components
 * @class
 */
class DocumentParser
{
    static #tagDictionary = {
        ...Dictionaries.toHeader1Dictionary(1),
        ...Dictionaries.toHeader2Dictionary(2),
        ...Dictionaries.toHeader3Dictionary(3),
        ...Dictionaries.toHeader4Dictionary(4),
        ...Dictionaries.toBoxDictionary(5),
        ...Dictionaries.toLinkDictionary(6),
        ...Dictionaries.toLinkContentDictionary(7),
        ...Dictionaries.toTextDictionary(8),
        ...Dictionaries.toListDictionary(9),
        ...Dictionaries.toAlignDictionary(10),
        ...Dictionaries.toBoldDictionary(11),
        ...Dictionaries.toGroupDictionary(12),
        ...Dictionaries.toVGroupDictionary(13),
        ...Dictionaries.toImageDictionary(14),
        ...Dictionaries.toFillDictionary(15),
        ...Dictionaries.toCircleDictionary(16),
        ...Dictionaries.toRollDictionary(17)
    }

    /**
     * Parses a text into react components using document Directory tags
     * @param {string} text 
     * @returns {React.Component} The parsed component
     */
    static parse = (text) => 
    {
        let parentStack = [{ 
            cmp: 0, 
            type: "holder",
            toComponent: (content) => content, 
            content: [] 
        }];

        let list = text.split(/(<.*?>)/);
        list.forEach((part) => this.#parsePart(part, parentStack));

        return this.#buildBody(parentStack[0], 0);
    }
    
    /**
     * Parses a node part modifying the stack
     * @param {string} part The part to parse
     * @param {[PartStackElement]} stack The stack holding the other nodes
     * @returns {void}
     */
    static #parsePart = (part, stack) =>
    {
        part = part.trim();
        if (part === "" || part === " ") return;

        let lookup = this.#tagDictionary[part];
        let parent = stack[stack.length - 1];
        if (lookup)
        {
            if (lookup.cmp === -parent.cmp) stack.pop();
            else
            {
                if (lookup.cmp < 0) return "An unexpected error ocurred";
                let item = {...lookup, content: []};
                parent.content.push(item);
                stack.push(item);
            }
        }
        else
        {
            parent.content.push({ type: "text", text: part });
        }
    }

    /**
     * Converts a StackElement node tree into React Components
     * @param {PartStackElement} node 
     * @param {number} index 
     * @returns {React.Component}
     */
    static #buildBody = (node, index) => 
    {
        return node.type === "text" ? node.text
            : node.toComponent(node.content.map((item, index) => this.#buildBody(item, index)), index);
    }
}

export default DocumentParser;