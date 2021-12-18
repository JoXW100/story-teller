import React, { useEffect, useState } from 'react';
import "../../styles/document.css";
import { 
    toHeader1Dictionary,
    toHeader2Dictionary,
    toHeader3Dictionary,
    toHeader4Dictionary,
    toBoxDictionary,
    toLinkDictionary,
    toLinkContentDictionary,
    toTextDictionary,
    toListDictionary,
    toAlignDictionary,
    toBoldDictionary,
    toGroupDictionary,
    toVGroupDictionary,
    toImageDictionary,
    toFillDictionary,
    toNodeDictionary,
    toCircleDictionary,
    toTreeDictionary,
    toRollDictionary
} from '../documentDictionaries';

const tagList = [
    toHeader1Dictionary,
    toHeader2Dictionary,
    toHeader3Dictionary,
    toHeader4Dictionary,
    toBoxDictionary,
    toLinkDictionary,
    toLinkContentDictionary,
    toTextDictionary,
    toListDictionary,
    toAlignDictionary,
    toBoldDictionary,
    toGroupDictionary,
    toVGroupDictionary,
    toImageDictionary,
    toFillDictionary,
    toNodeDictionary,
    toCircleDictionary,
    toTreeDictionary,
    toRollDictionary
]

let tagDictionary = {};
tagList.forEach((toTag, index) => tagDictionary = {...tagDictionary, ...(toTag(index + 1))});

/**
 * 
 * @param {{ document: DBFile }} 
 * @returns {React.Component}
 */
const DocumentRender = ({ document }) => 
{
    const buildTree = (document) => 
    {
        let parentStack = [{ 
            cmp: 0, 
            type: "holder",
            toComponent: (content) => content, 
            content: [] 
        }];
        let list = document.content.text.split(/(<.*?>)/);
        list.forEach((part) => {

            part = part.trim();
            if (part === "" || part === " ") return;

            let lookup = tagDictionary[part];
            let parent = parentStack[parentStack.length - 1];
            if (lookup)
            {
                if (lookup.cmp == -parent.cmp) parentStack.pop();
                else
                {
                    if (lookup.cmp < 0) return "An unexpected error ocurred";
                    let item = {...lookup, content: []};
                    parent.content.push(item);
                    parentStack.push(item);
                }
            }
            else
            {
                parent.content.push({ type: "text", text: part});
            }
        });

        return parentStack;
    }

    const buildBody = (parents, index) => 
    {
        if (parents.length !== 1) return `Missing closing node: </${parents[parents.length - 1].type}>`;
        return buildBodyHelper(parents[0], 0);
    }

    const buildBodyHelper = (node, index) => 
    {
        if (node.type === "text") return node.text;
        return node.toComponent(node.content.map((item, index) => buildBodyHelper(item, index)), index);
    }
    
    return (
        <div className="documentBackground">
            { document &&
                <>
                     { document.content.data.title && <div className={"documentTitle"}> {document.content.data.title} </div>}
                    <div className={"documentBody"}> 
                        {document && buildBody(buildTree(document))} 
                    </div>
                </>
            }
        </div>
    );
}

export default DocumentRender;