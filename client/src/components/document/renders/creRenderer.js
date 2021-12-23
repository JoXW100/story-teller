import React, { useEffect, useState } from 'react';
import DocumentParser from '../../../classes/documentParser';
import { documentToComponent } from '../documentRender';

/**
 * 
 * @param {{ document: DBFile }} 
 * @returns {React.Component}
 */
const CreRenderer = ({ document }) => 
{
    /** @type {DBCreatureFileContent} */
    const data = document.content;

    const [state, setState] = useState({ loading: true, content: null });

    const attributeToModifier = (key) => Math.floor(data.stats.attributes[key] / 2) - 5
    const healthBonus = attributeToModifier("con") * data.stats.level;
    const health = Math.floor((data.stats.hitDice + 1.0) / 2.0 * data.stats.level) + healthBonus;
    const proficiency = Math.ceil(data.stats.level / 4) + 1;

    const healthText = healthBonus > 0 
        ? `${health} (${data.stats.level}d${data.stats.hitDice} + ${healthBonus})`
        : `${health} (${data.stats.level}d${data.stats.hitDice})`

    const speedText = Object.keys(data.stats.speed).reduce((text, key) => 
        data.stats.speed[key] > 0 
        ? (text.length > 0 ? `${text}, ${key}: ${data.stats.speed[key]} ft` 
        : `${key}: ${data.stats.speed[key]} ft`) 
        : text, "");

    const spellSlotMap = (level, num) => 
        level > 3 ? `${level}th level (${num} slots):` :
        level === 3 ? `${level}rd level (${num} slots):` : 
        level === 2 ? `${level}nd level (${num} slots):` : 
        level === 1 ? `${level}st level (${num} slots):` : 
        `Cantrips:`

    const abilitiesContent = [
        { type: "header2", content: "Abilities" },
        ...(data.abilities.map((id) => (
            { 
                type: "link-content", 
                args: { target: id, attributes: data.stats.attributes, proficiency: proficiency }
            }
        )))
    ];

    const spellsContent = [
        { type: "header2", content: "Spells" },
        ...([0, ...data.spells.spellSlots].map((slot, index) => (
            { type: "header4", content: spellSlotMap(index, slot) }
        )))
    ];

    const content = 
    [
        { type: "align", content: [
            { type: "fill", content: [
                { type: "v-group", content: [
                    { type: "text", content: [{ type: "bold", content: `${data.size} ${data.type}, ${data.alignment}`} ]},
                    { type: "box", content: [ 
                        { type: "header3", content: "Description" },
                        { type: "text", content: [ data.shortText ]}
                    ]}
                ]}
            ]},
            { type: "image", args: { imageID: data.portraitID, flex: 0.3 }}
        ]},
        { type: "header2", content: "Stats" },
        { type: "box", content: [
            { type: "align", content: [
                { type: "v-group", content: [{ type: "bold", content: "Armor Class" }, data.stats.armor ]},
                { type: "v-group", content: [{ type: "bold", content: "Hit Points" }, healthText ]},
                { type: "v-group", content: [{ type: "bold", content: "Speed" }, speedText ]},
                { type: "roll", args: { mod: attributeToModifier("dex") }, content: [{ type: "bold", content: "Initiative" }]}
            ]},
            { type: "header3", content: "Attributes" },
            { type: "align", content: Object.keys(data.stats.attributes).map((key) => (
                { 
                    type: "roll", 
                    args: { mod: attributeToModifier(key) }, 
                    content: [{ type: "bold", content: key.toUpperCase()}, `: ${data.stats.attributes[key]}`]
                }
            ))},
            { type: "header3", content: "Saving Throws" },
            { type: "align", content: Object.keys(data.stats.savingThrows).map((key) => (
                { 
                    type: "roll", 
                    args: { mod: data.stats.savingThrows[key] * proficiency + attributeToModifier(key) }, 
                    content: [{ type: "bold", content: key.toUpperCase()}]
                }
            ))},
        ]},
        { type: "box", content: [
            { type: "align", content: [
                { type: "v-group", content: [{ type: "bold", content: "Senses" }, ...(data.stats.senses.length > 0 ? data.stats.senses : '-')]},
                { type: "v-group", content: [{ type: "bold", content: "Languages" }, ...(data.stats.senses.length > 0 ? data.stats.languages : '-')]},
                { type: "v-group", content: [{ type: "bold", content: "Challenge" }, data.stats.challenge]},
                { type: "v-group", content: [{ type: "bold", content: "Proficiency Bonus" }, proficiency]}
            ]}
        ]},
        { type: "box", content: [
            { type: "align", content: [
                { type: "v-group", content: [{ type: "bold", content: "Resistances" }, ...(data.stats.resistances.length > 0 ? data.stats.resistances : '-')]},
                { type: "v-group", content: [{ type: "bold", content: "Immunities" }, ...(data.stats.immunities.length > 0 ? data.stats.immunities : '-')]},
                { type: "v-group", content: [{ type: "bold", content: "Advantages" }, ...(data.stats.advantages.length > 0 ? data.stats.advantages : '-')]},
                { type: "v-group", content: [{ type: "bold", content: "Disadvantages" }, ...(data.stats.disadvantages.length > 0 ? data.stats.disadvantages : '-')]}
            ]}
        ]},
        ...(data.abilities.length > 0 ? abilitiesContent : []),
        ...(data.spells.casterType !== "none" ? spellsContent : []),
        DocumentParser.parse(data.text)
    ];

    useEffect(() => setState({ loading: false, content: content.map((x, key) => documentToComponent(x, key)) }), [document])

    return state.loading ? null : (
        <div className="documentBackground">
            <div className={"documentTitle"}> {data.name} </div>
            <div className={"documentBody"}> 
                { state.content }
            </div>
        </div>
    );
}

export default CreRenderer;