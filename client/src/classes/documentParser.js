import * as Dictionaries from '../parserElements/index';

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
        ...Dictionaries.toLinkTitleDictionary(8),
        ...Dictionaries.toTextDictionary(9),
        ...Dictionaries.toListDictionary(10),
        ...Dictionaries.toAlignDictionary(11),
        ...Dictionaries.toBoldDictionary(12),
        ...Dictionaries.toGroupDictionary(13),
        ...Dictionaries.toVGroupDictionary(14),
        ...Dictionaries.toImageDictionary(15),
        ...Dictionaries.toFillDictionary(16),
        ...Dictionaries.toCircleDictionary(17),
        ...Dictionaries.toRollDictionary(18),
        ...Dictionaries.toCollapsibleDictionary(19),
        ...Dictionaries.toTableDictionary(20),
        ...Dictionaries.toTableHeaderDictionary(21),
        ...Dictionaries.toTableItemDictionary(22),
        ...Dictionaries.toTableRowDictionary(23)
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