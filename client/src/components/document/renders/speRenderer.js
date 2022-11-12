import React, { useEffect, useState } from 'react';
import DocumentParser from '../../../classes/documentParser';
import { documentToComponent } from '../documentRender';

/**
 * 
 * @param {{ doc: DBFile }} 
 * @returns {React.Component}
 */
const SpeRenderer = ({ doc }) => 
{
    useEffect(() =>
    {
        if (doc.content?.name) document.title = doc.content.name;
    }, [doc.content]);

    return (
        <div className="documentBackground">
            <div className={"documentBody"}> 
                <SpellFile document={doc}/>
                {DocumentParser.parse(doc.content.text)} 
            </div>
        </div>
    );
}

/**
 * 
 * @param {{ document: DBFile }} 
 * @returns {React.Component}
 */
export const SpellFile = ({ document, attributes = undefined, proficiency = 0 }) => 
{
    /** @type {DBSpellFileContent} */
    const data = document.content;
    const hitRoll = data.roll;
    const effectRoll = data.effect.roll;

    const [state, setState] = useState({ loading: true, content: null });

    const attributeToModifier = (key) => Math.floor(attributes[key] / 2) - 5

    const conditionMod = () => attributes && hitRoll.scalingModifier !== "none"
        ? hitRoll.baseModifier + hitRoll.proficiency * proficiency + attributeToModifier(hitRoll.scalingModifier)
        : hitRoll.baseModifier + hitRoll.proficiency * proficiency;
    
    const effectMod = () => attributes && effectRoll.scalingModifier !== "none"
        ? effectRoll.baseModifier + effectRoll.proficiency * proficiency + attributeToModifier(effectRoll.scalingModifier)
        : effectRoll.baseModifier + effectRoll.proficiency * proficiency;

    const getEffectDmg = () => data.effect.type === "none" 
        ? { type: "v-group", content: [{ type: "bold", content: "Effect" }, data.effect.successEffect ]}
        : { type: "roll", content: [{ type: "bold", content: "Effect" }, ` (${data.effect.dmg})`], args: { dice: effectRoll.diceSize, num: effectRoll.diceNum, mod: effectMod(), isDmg: true }}

    const getEffectHit = () => {
        switch (data.conditionType) {
            case "hit": 
                return { type: "roll", content: [{ type: "bold", content: "Hit/DC" }], args: { dice: hitRoll.diceSize, num: hitRoll.diceNum, mod: conditionMod() }};
            
            case "save":
                return { type: "v-group", content: [{ type: "bold", content: "Hit/DC" }, `${conditionMod()} ${data.saveAttribute.toUpperCase()}`]};
                
            default:
                return { type: "v-group", content: [{ type: "bold", content: "Hit/DC" }, "-" ]};
        }
    };

    const content = 
    [
        { type: "collapsible", content: [
            { type: "align", content: [
                { type: "v-group", content: [{ type: "bold", content: "Name"}, data.name]},
                { type: "v-group", content: [{ type: "bold", content: "Time"}, data.castingTime]},
                { type: "v-group", content: [{ type: "bold", content: "Range"}, data.effect.area === "none" ? data.effect.range : `${data.effect.range} (${data.effect.area})`]},
                { type: "v-group", content: [{ type: "bold", content: "Duration"}, data.concentration ? `${ data.duration} (C)` : data.duration]},
                { type: "v-group", content: [{ type: "bold", content: "Components"}, data.components]},
                getEffectHit(),
                getEffectDmg()
            ]}
        ], args: { text: data.shortText, default: "false" } }
    ];

    useEffect(() => setState({ loading: false, content: content.map((x, key) => documentToComponent(x, key)) }), [document])

    return state.loading ? null : state.content;
}


export default SpeRenderer;