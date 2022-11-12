import React, { useEffect, useState } from 'react';
import DocumentParser from '../../../classes/documentParser';
import Server from '../../../server/server';
import { documentToComponent } from '../documentRender';
import { AbilityFile } from './abiRenderer';
import { SpellFile } from './speRenderer';

/**
 * 
 * @param {{ doc: DBFile }} 
 * @returns {React.Component}
 */
const CreRenderer = ({ doc }) => 
{
    /** @type {DBCreatureFileContent} */
    const data = doc.content;
    const [state, setState] = useState({ loading: true, content: null });
    console.log(data)

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

    const arrayToString = (array) => {
        return array.join(', ');
    }

    const capitalize = (text) => text[0]?.toUpperCase() + text.slice(1)?.toLowerCase();

    const getAbilities = (abilities) => [
        ...(abilities.none.length > 0 ? [
            { type: "header2", content: "Abilities" },
            ...abilities.none.map((abi) => <AbilityFile key={abi._id} document={abi} attributes={data.stats.attributes} proficiency={proficiency}/>),
        ] : []),
        ...(abilities.action.length > 0 ? [
            { type: "header2", content: "Actions" },
            ...abilities.action.map((abi) => <AbilityFile key={abi._id} document={abi} attributes={data.stats.attributes} proficiency={proficiency}/>),
        ] : []),
        ...(abilities.bonus.length > 0 ? [
            { type: "header2", content: "Bonus Actions" },
            ...abilities.bonus.map((abi) => <AbilityFile key={abi._id} document={abi} attributes={data.stats.attributes} proficiency={proficiency}/>),
        ] : []),
        ...(abilities.reaction.length > 0 ? [
            { type: "header2", content: "Reactions" },
            ...abilities.reaction.map((abi) => <AbilityFile key={abi._id} document={abi} attributes={data.stats.attributes} proficiency={proficiency}/>),
        ] : []),
        ...(abilities.free.length > 0 ? [
            { type: "header2", content: "Free" },
            ...abilities.free.map((abi) => <AbilityFile key={abi._id} document={abi} attributes={data.stats.attributes} proficiency={proficiency}/>),
        ] : [])
    ];

    const getSpells = (spells) => [
        { type: "header2", content: "Spells" },
        ...([0, ...data.spells.spellSlots].map((num, level) => spells[level]?.length > 0 ? [
            { type: "header4", content: spellSlotMap(level, num) },
            ...(spells[level].map((spe) => <SpellFile key={spe._id} document={spe} attributes={data.stats.attributes} proficiency={proficiency}/>))
        ] : []).flat())
    ]

    const getContent = (abilities, spells) => [
        { type: "align", content: [
            { type: "fill", content: [
                { type: "v-group", content: [
                    { type: "text", content: [{ type: "bold", content: `${capitalize(data.size)} ${capitalize(data.type)}, ${capitalize(data.alignment)}`} ]},
                    { type: "box", content: [ 
                        { type: "header3", content: "Description" },
                        { type: "text", content: [ DocumentParser.parse(data.shortText) ]}
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
                { type: "v-group", content: [{ type: "bold", content: "Senses" }, data.stats.senses.length > 0 ? arrayToString(data.stats.senses) : '-']},
                { type: "v-group", content: [{ type: "bold", content: "Languages" }, data.stats.languages.length > 0 ? arrayToString(data.stats.languages) : '-']},
                { type: "v-group", content: [{ type: "bold", content: "Challenge" }, data.stats.challenge]},
                { type: "v-group", content: [{ type: "bold", content: "Proficiency Bonus" }, proficiency]}
            ]}
        ]},
        { type: "box", content: [
            { type: "align", content: [
                { type: "v-group", content: [{ type: "bold", content: "Resistances" }, data.stats.resistances.length > 0 ? arrayToString(data.stats.resistances) : '-']},
                { type: "v-group", content: [{ type: "bold", content: "Immunities" }, data.stats.immunities.length > 0 ? arrayToString(data.stats.immunities) : '-']},
                { type: "v-group", content: [{ type: "bold", content: "Advantages" }, data.stats.advantages.length > 0 ? arrayToString(data.stats.advantages) : '-']},
                { type: "v-group", content: [{ type: "bold", content: "Disadvantages" }, data.stats.disadvantages.length > 0 ? arrayToString(data.stats.disadvantages) : '-']}
            ]}
        ]},
        ...getAbilities(abilities),
        ...(data.spells.casterType !== "none" && Object.keys(spells).length > 0 ? getSpells(spells) : [])
    ].map((x, key) => documentToComponent(x, key));

    useEffect(() => 
    {
        let abilities = { none: [], action: [], bonus: [], reaction: [], free: [] };
        let spells = { };
        let promises = [];

        let abilityIDs = data.abilities.filter((x) => x.length === 24);
        if (abilityIDs.length > 0)
        {
            promises.push(Server.files.getAll(abilityIDs))
        }
        let spellIDs = data.spells.spellIDs.filter((x) => x.length === 24);
        if (spellIDs.length > 0)
        {
            promises.push(Server.files.getAll(spellIDs));
        }

        if (promises.length > 0)
        {
            Promise.all(promises)
            .then((response) => 
            {
                let spe = response.find(x => x.result[0].type === "spe")?.result;
                let abi = response.find(x => x.result[0].type === "abi")?.result;

                if (spe) spe.forEach((x) => spells[x.content.level] ? spells[x.content.level].push(x) : spells[x.content.level] = [x]);
                if (abi) abi.forEach((x) => abilities[x.content.actionType].push(x));

                setState({ loading: false, content: getContent(abilities, spells)});
            })
            .catch((reason) => {
                console.error(reason);
                setState({ loading: false, content: getContent(abilities, spells)});
            });
        }
        else
        {
            setState({ loading: false, content: getContent(abilities, spells)});
        }

        if (data?.name) document.title = data.name;

    }, [doc]);

    return state.loading ? null : (
        <div className="documentBackground">
            <div className={"documentTitle"}> {data.name} </div>
            <div className={"documentBody"}> 
                { state.content }
                { DocumentParser.parse(data.text) }
            </div>
        </div>
    );
}

// { data.abilities.map((id) => <AbilityFile document={id} attributes={data.stats.attributes} proficiency={proficiency}/> ) }

export default CreRenderer;