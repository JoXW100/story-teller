import React, { useEffect, useState } from 'react';
import DocumentParser from '../../../classes/documentParser';
import { documentToComponent } from '../documentRender';

/**
 * 
 * @param {{ doc: DBFile }} 
 * @returns {React.Component}
 */
const AbiRenderer = ({ doc }) => 
{
    useEffect(() =>
    {
        if (doc.content?.name) document.title = doc.content.name;
    }, [doc.content]);

    return (
        <div className="documentBackground">
            <div className={"documentBody"}> 
                <AbilityFile document={doc}/>
                {DocumentParser.parse(doc.content.text)} 
            </div>
        </div>
    );
}

/**
 * 
 * @param {{ document: DBFile, attributes: CreatureAttributes, proficiency: number}}
 * @returns {React.Component}
 */
export const AbilityFile = ({ document, attributes = undefined, proficiency = 0 }) => 
{
    /** @type {DBAbilityFileContent} */
    const data = document.content;
    const hitRoll = data.roll;
    const effectRoll = data.effect.roll;

    const [state, setState] = useState({ loading: true, content: null});
    
    const attributeToModifier = (key) => attributes[key] ? Math.floor(attributes[key] / 2) - 5 : 0

    const conditionMod = attributes 
        ? hitRoll.baseModifier + hitRoll.proficiency * proficiency + attributeToModifier(hitRoll.scalingModifier)
        : hitRoll.baseModifier + hitRoll.proficiency * proficiency;
    
    const effectMod = attributes 
        ? effectRoll.baseModifier + effectRoll.proficiency * proficiency + attributeToModifier(effectRoll.scalingModifier)
        : effectRoll.baseModifier + effectRoll.proficiency * proficiency;

        const getEffectDmg = () => data.effect.type === "none" 
        ? { type: "v-group", content: [{ type: "bold", content: "Effect" }, data.effect.successEffect ]}
        : { type: "roll", content: [{ type: "bold", content: "Damage" }, ` (${data.effect.type})`], args: { dice: effectRoll.diceSize, num: effectRoll.diceNum, mod: effectMod, isDmg: true }}

    const getEffect = () => {
        switch (data.conditionType) {
            case "hit": 
                return [
                    { type: "roll", content: [{ type: "bold", content: "Hit/DC" }], args: { dice: hitRoll.diceSize, num: hitRoll.diceNum, mod: conditionMod }},
                    getEffectDmg()
                ];
            
            case "save":
                return [
                    { type: "v-group", content: [{ type: "bold", content: "Hit/DC" }, [`${conditionMod} ${data.saveAttribute.toUpperCase()}`]]},
                    getEffectDmg()
                ];
                
            default:
                return [];
        }
    };

    const content = data.abilityType === "none" 
        ? [{ type: "box", content: [ { type: "header3", content: data.name }, DocumentParser.parse(data.shortText) ]}] 
        : [{ type: "box", content: [
            { type: "align", content: [
                { type: "v-group", content: [{ type: "bold", content: "Name"}, data.name]},
                { type: "v-group", content: [{ type: "bold", content: "Type"}, data.abilityType]},
                { type: "v-group", content: [{ type: "bold", content: "Range" }, data.effect.range ]},
                { type: "v-group", content: [{ type: "bold", content: "Notes" }, data.notes ]},
                ...(getEffect())
            ]},
            ...(data.shortText.length > 0 ? [
                { type: "header3" }, DocumentParser.parse(data.shortText)
            ] : [])
        ]}
    ]

    useEffect(() => setState({ loading: false, content: content.map((x, key) => documentToComponent(x, key))}), [document]);

    return state.loading ? null : state.content;
}

export default AbiRenderer;