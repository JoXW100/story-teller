import React, { useEffect, useState } from 'react';
import DocumentParser from '../../../classes/documentParser';
import { documentToComponent } from '../documentRender';

/**
 * 
 * @param {{ document: DBFile }} 
 * @returns {React.Component}
 */
const AbiRenderer = ({ document }) => 
{
    return (
        <div className="documentBackground">
            <div className={"documentBody"}> 
                <AbilityFile document={document}/>
                {DocumentParser.parse(document.content.text)} 
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
    
    const attributeToModifier = (key) => Math.floor(attributes[key] / 2) - 5

    const hitMod = attributes 
        ? hitRoll.baseModifier + hitRoll.proficiency * proficiency + attributeToModifier(hitRoll.scalingModifier)
        : hitRoll.baseModifier + hitRoll.proficiency * proficiency;
    
    const effectMod = attributes 
        ? effectRoll.baseModifier + effectRoll.proficiency * proficiency + attributeToModifier(hitRoll.scalingModifier)
        : effectRoll.baseModifier + effectRoll.proficiency * proficiency;

    const abilityTypeTable = {
        "Melee Weapon": [
            { type: "v-group", content: [{ type: "bold", content: "Range" }, data.effect.range ]},
            { type: "v-group", content: [{ type: "bold", content: "Notes" }, data.notes ]},
            { type: "roll", content: [{ type: "bold", content: "Hit/DC" }], args: { dice: hitRoll.diceSize, num: hitRoll.diceNum, mod: hitMod }},
            { type: "roll", content: [{ type: "bold", content: "Damage" }, ` (${data.effect.type})`], args: { dice: effectRoll.diceSize, num: effectRoll.diceNum, mod: effectMod, isDmg: true }}
        ]
    };

    const content = [
        { type: "box", content: [
            { type: "align", content: [
                { type: "v-group", content: [{ type: "bold", content: "Name"}, data.name]},
                { type: "v-group", content: [{ type: "bold", content: "Type"}, data.abilityType]},
                ...(abilityTypeTable[data.abilityType])
            ]}
        ]}
    ]

    useEffect(() => setState({ loading: false, content: content.map((x, key) => documentToComponent(x, key))}), [document]);

    return state.loading ? null : state.content;
}

export default AbiRenderer;