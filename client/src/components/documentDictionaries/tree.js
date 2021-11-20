import React from 'react';
import "../../styles/document.css";

export const toTreeDictionary = (index) => ({
    "<tree>": { 
        cmp: index,  
        type: "tree", 
        toComponent: (content, index) => <DocumentTree key={index} content={content}/> 
    },
    "</tree>": { 
        cmp: -index 
    }
});

/**
 * 
 * @param {{ content: [React.ReactElement] }} 
 * @returns { React.ReactElement }
 */
const DocumentTree = ({ content }) => 
{
    const layers = new TreeLayer(content);

    return (
        <div className="documentTreeRoot"> 
            {layers.toComponents()}
        </div>
    );
}

export default DocumentTree;

class TreeLayer
{
    #content;
    #nodes;
    #next;

    /**
     * @param {[React.ReactElement]} elements
     */
    constructor(elements)
    {
        let [nodes, content] = elements.reduce(([pass, fail], elem) => (
            elem.type?.name === "DocumentTreeNode" 
                ? [[...pass, elem], fail] 
                : [pass, [...fail, elem]]
        ), [[], []]);

        this.#nodes   = nodes;
        this.#content = content;

        console.log(nodes);
    }

    get length() 
    {
        return this.#content.length;
    }

    get maxLength()
    {
        return this.length < this.#next?.maxLength 
            ? this.#next?.maxLength
            : this.length;
    }

    toComponents()
    {
        return [];
    }
}