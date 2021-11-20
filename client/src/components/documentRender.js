import React, { useEffect, useState } from 'react';
import "../styles/document.css";
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
} from './documentDictionaries';

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
 * @param {{ document: StoryDocument }} 
 * @returns {React.Component}
 */
const DocumentRender = ({ document }) => 
{
    const [doc, setDoc] = useState(document);

    const buildTree = (list) => 
    {
        let parentStack = [{ 
            cmp: 0, 
            type: "holder",
            toComponent: (content) => content, 
            content: [] 
        }];

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

    const documentToBody = () => 
    {
        if (!doc || !doc.data || !doc.data.body) return "";
        return buildBody(buildTree(doc.data.body.split(/(<.*?>)/)));
    }

    useEffect(() => setDoc(document), [document]);
    
    return (
        <div className="documentBackground">
            { doc &&
                <>
                    <div className={"documentTitle"}> {doc.data.title} </div>
                    <div className={"documentBody"}> 
                        {documentToBody()} 
                    </div>
                </>
            }
        </div>
    );
}

export default DocumentRender;