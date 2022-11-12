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
        ...Dictionaries.toHeader5Dictionary(5),
        ...Dictionaries.toBoxDictionary(6),
        ...Dictionaries.toLinkDictionary(7),
        ...Dictionaries.toLinkContentDictionary(8),
        ...Dictionaries.toLinkTitleDictionary(9),
        ...Dictionaries.toTextDictionary(10),
        ...Dictionaries.toListDictionary(11),
        ...Dictionaries.toAlignDictionary(12),
        ...Dictionaries.toBoldDictionary(13),
        ...Dictionaries.toGroupDictionary(14),
        ...Dictionaries.toVGroupDictionary(15),
        ...Dictionaries.toImageDictionary(16),
        ...Dictionaries.toFillDictionary(17),
        ...Dictionaries.toCircleDictionary(18),
        ...Dictionaries.toRollDictionary(19),
        ...Dictionaries.toCollapsibleDictionary(20),
        ...Dictionaries.toTableDictionary(21),
        ...Dictionaries.toTableHeaderDictionary(22),
        ...Dictionaries.toTableItemDictionary(23),
        ...Dictionaries.toTableRowDictionary(24)
    }

    /**
     * Parses a text into react components using document Directory tags
     * @param {string} text 
     * @returns {React.Component} The parsed component
     */
    static parse = (text) => 
    {
        let stack = [{ 
            cmp: 0, 
            type: "holder",
            toComponent: (content) => content, 
            content: [] 
        }];

        let bracketCounter = 0;
        let contentStart = 0;
        let match;

        let indexes = [];
        let reg = /[>]/g;
        while (match = reg.exec(text))
        {
            indexes.push(match.index)
        }

        if (indexes.length === 0) return text;
        
        let bracketIndexes = [];
        reg = /[\[\]]/g;
        while (match = reg.exec(text))
        {
            bracketIndexes.push(match.index)
        }

        for (let index = 0; index < text.length; index++) 
        {
            if (bracketCounter > 0)
            {
                index = bracketIndexes.find(x => x >= index);
            }
            let parent = stack[stack.length - 1];

            switch (text[index]) 
            {
                case '[':
                    if (parent.type !== 'holder') bracketCounter++;
                    break;
                case ']':
                    if (parent.type !== 'holder') bracketCounter--;
                    break;

                case '<':

                    // Push Content
                    let content = text.substring(contentStart, index).trim();
                    if (content.length > 0) parent.content.push({ type: "text", text: content });
                    
                    // Find Header End
                    let end = indexes.find(n => n > index);
                    if (!end) return "Error";

                    let subString = text.substring(index, end + 1);
                    let lookup = this.#tagDictionary[subString];
                    index = end;
                    contentStart = end + 1;

                    // If a known element
                    if (lookup)
                    {
                        if (lookup.cmp === -parent.cmp) stack.pop();
                        else if (lookup.cmp > 0)
                        {
                            let item = {...lookup, content: []};
                            parent.content.push(item);
                            stack.push(item);
                        }
                    }
                    else
                    {
                        parent.content.push({ type: "text", text: subString })
                    }
                    
            
                default:
                    break;
            }
        }

        // Finally add the remaining text
        let subString = text.substring(contentStart, text.length);
        if (subString.length > 0) stack[0].content.push({ type: "text", text: subString })

        return this.#buildBody(stack[0]);
    }

    /**
     * Converts a StackElement node tree into React Components
     * @param {PartStackElement} node 
     * @param {number} index 
     * @returns {React.Component}
     */
    static #buildBody = (node, index) => 
    {
        return node.type === "text" ? node.text.trim()
            : node.toComponent(node.content.map((item, index) => this.#buildBody(item, index)), index);
    }
}

export default DocumentParser;