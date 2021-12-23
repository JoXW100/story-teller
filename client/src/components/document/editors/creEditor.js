import React, { useEffect, useState } from 'react';
import Server from '../../../server/server';
import DocumentArraySection from '../documentComponents/documentArraySection';
import DocumentEditFileSection from '../documentComponents/documentEditFileSection';
import DocumentEditGroupSection from '../documentComponents/documentEditGroupSection';
import DocumentEditInputSection from '../documentComponents/documentEditInputSection';

/**
 * 
 * @param {{ document: DBFile }} 
 * @returns 
 */
const CreEditor = ({ document, onChange }) => 
{
    /** @type {[ state: { content: DBCreatureFileContent, loading: boolean, isSaving: boolean, isQueued: boolean }, setContent: (content: DBCreatureFileContent) => void]} */

    const [state, setState] = useState({ 
        content: document.content, 
        loading: true,
        isSaving: false,
        isQueued: false
    });

    const save = (override = false) => 
    {
        if (state.isSaving && !override) 
        {
            if (!state.isQueued) setState({ ...state, isQueued: true });
        }
        else
        {
            let update = {
                ["content.shortText"]: state.content.shortText,
                ["content.title"]: state.content.title,
                ["content.text"]: state.content.text
            }
            Server.files.update(document._id, update)
            .catch(console.error())
            .then((response) => {
                if (!response) console.error("Failed Saving");
                
                if (state.isQueued && !override)
                {
                    setState({ ...state, isSaving: false, isQueued: false });
                    save(true);
                }
                else
                {
                    setState({ ...state, isSaving: false });
                    onChange();
                }
            });
        }
    }

    useEffect(() => 
    {
        setState({ 
            content: document.content, 
            loading: true,
            isSaving: false,
            isQueued: false
        });
    }, [document]);
    
    useEffect(() => 
    {
        if (state.loading) setState({ ...state, loading: false });
        else save();
    }, [state.content]);

    return (
        <div className="editBackground">
            <DocumentEditGroupSection text="Info">
                <DocumentEditInputSection 
                    text="Name"
                    value={state.content.name} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, name: value }})}
                />
                <DocumentEditInputSection 
                    text="Type"
                    value={state.content.type} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, type: value }})}
                />
                <DocumentEditInputSection 
                    text="Size"
                    value={state.content.size} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, size: value }})}
                />
                <DocumentEditInputSection 
                    text="Alignment"
                    value={state.content.alignment} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, alignment: value }})}
                />
                <DocumentEditFileSection
                    text="Portrait"
                    setValue={(value) => setState({ ...state, content: { ...state.content, portraitID: value?.assetFileID }})}
                    documentID={document._id}
                />
                <DocumentArraySection
                    text="Abilities"
                    value={state.content.abilities} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, abilities: value }})}
                />
                <DocumentEditInputSection 
                    text="Description"
                    value={state.content.shortText} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, shortText: value }})} 
                    multiline={true}
                />
            </DocumentEditGroupSection>

            <DocumentEditGroupSection text="Stats">
                <DocumentEditInputSection 
                    text="Level"
                    type="number"
                    value={state.content.stats.level} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, level: parseInt(value) }}})}
                />
                <DocumentEditInputSection
                    text="HitDice"
                    type="number"
                    value={state.content.stats.hitDice} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, hitDice: parseInt(value) }}})}
                />
                <DocumentEditInputSection
                    text="Armor"
                    type="number"
                    value={state.content.stats.armor} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, armor: parseInt(value) }}})}
                />
                <DocumentArraySection
                    text="Senses"
                    value={state.content.stats.senses} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, senses: value }}})}
                />
                <DocumentArraySection
                    text="Languages"
                    value={state.content.stats.languages} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, languages: value }}})}
                />
                <DocumentArraySection
                    text="Resistances"
                    value={state.content.stats.resistances} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, resistances: value }}})}
                />
                <DocumentArraySection
                    text="Immunities"
                    value={state.content.stats.immunities} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, immunities: value }}})}
                />
                <DocumentArraySection
                    text="Advantages"
                    value={state.content.stats.advantages} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, advantages: value }}})}
                />
                <DocumentArraySection
                    text="Disadvantages"
                    value={state.content.stats.disadvantages} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, disadvantages: value }}})}
                />
                <DocumentEditInputSection
                    text="Challenge"
                    value={state.content.stats.challenge} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, challenge: value }}})}
                />

                <DocumentEditGroupSection text="Attributes">
                    <DocumentEditInputSection 
                        text="STR"
                        type="number"
                        value={state.content.stats.attributes.str} 
                        setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, attributes: { ...state.content.stats.attributes, str: parseInt(value) }}}})}
                    />
                    <DocumentEditInputSection 
                        text="DEX"
                        type="number"
                        value={state.content.stats.attributes.dex} 
                        setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, attributes: { ...state.content.stats.attributes, dex: parseInt(value) }}}})}
                    />
                    <DocumentEditInputSection 
                        text="CON"
                        type="number"
                        value={state.content.stats.attributes.con} 
                        setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, attributes: { ...state.content.stats.attributes, con: parseInt(value) }}}})}
                    />
                    <DocumentEditInputSection 
                        text="INT"
                        type="number"
                        value={state.content.stats.attributes.int} 
                        setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, attributes: { ...state.content.stats.attributes, int: parseInt(value) }}}})}
                    />
                    <DocumentEditInputSection 
                        text="WIS"
                        type="number"
                        value={state.content.stats.attributes.wis} 
                        setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, attributes: { ...state.content.stats.attributes, wis: parseInt(value) }}}})}
                    />
                    <DocumentEditInputSection 
                        text="CHA"
                        type="number"
                        value={state.content.stats.attributes.cha} 
                        setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, attributes: { ...state.content.stats.attributes, cha: parseInt(value) }}}})}
                    />
                </DocumentEditGroupSection>

                <DocumentEditGroupSection text="Saving throws">
                    <DocumentEditInputSection 
                        text="STR"
                        type="number"
                        value={state.content.stats.savingThrows.str} 
                        setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, savingThrows: { ...state.content.stats.savingThrows, str: parseInt(value) }}}})}
                    />
                    <DocumentEditInputSection 
                        text="DEX"
                        type="number"
                        value={state.content.stats.savingThrows.dex} 
                        setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, savingThrows: { ...state.content.stats.savingThrows, dex: parseInt(value) }}}})}
                    />
                    <DocumentEditInputSection 
                        text="CON"
                        type="number"
                        value={state.content.stats.savingThrows.con} 
                        setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, savingThrows: { ...state.content.stats.savingThrows, con: parseInt(value) }}}})}
                    />
                    <DocumentEditInputSection 
                        text="INT"
                        type="number"
                        value={state.content.stats.savingThrows.int} 
                        setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, savingThrows: { ...state.content.stats.savingThrows, int: parseInt(value) }}}})}
                    />
                    <DocumentEditInputSection 
                        text="WIS"
                        type="number"
                        value={state.content.stats.savingThrows.wis} 
                        setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, savingThrows: { ...state.content.stats.savingThrows, wis: parseInt(value) }}}})}
                    />
                    <DocumentEditInputSection 
                        text="CHA"
                        type="number"
                        value={state.content.stats.savingThrows.cha} 
                        setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, savingThrows: { ...state.content.stats.savingThrows, cha: parseInt(value) }}}})}
                    />
                </DocumentEditGroupSection>

                <DocumentEditGroupSection text="Speed">
                    <DocumentEditInputSection 
                        text="Walk"
                        value={state.content.stats.speed.walk} 
                        setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, speed: { ...state.content.stats.speed, walk: value }}}})}
                    />
                    <DocumentEditInputSection
                        text="Swim"
                        value={state.content.stats.speed.swim} 
                        setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, speed: { ...state.content.stats.speed, swim: value }}}})}
                    />
                    <DocumentEditInputSection
                        text="Fly"
                        value={state.content.stats.speed.fly} 
                        setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, speed: { ...state.content.stats.speed, fly: value }}}})}
                    />
                    <DocumentEditInputSection
                        text="Burrow"
                        value={state.content.stats.speed.burrow} 
                        setValue={(value) => setState({ ...state, content: { ...state.content, stats: { ...state.content.stats, speed: { ...state.content.stats.speed, burrow: value }}}})}
                    />
                </DocumentEditGroupSection> 
            </DocumentEditGroupSection>
            
            <DocumentEditGroupSection text="Spells">
                <DocumentEditInputSection 
                    text="Caster Type"
                    value={state.content.spells.casterType} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, spells: { ...state.content.spells, casterType: value }}})}
                />
                <DocumentArraySection
                    text="Spell Slots"
                    type="number"
                    defaultValue={0}
                    value={state.content.spells.spellSlots}
                    setValue={(value) => setState({ ...state, content: { ...state.content, spells: { ...state.content.spells, spellSlots: value }}})}
                />
                <DocumentArraySection
                    text="Spells"
                    value={state.content.spells.spellIDs}
                    setValue={(value) => setState({ ...state, content: { ...state.content, spells: { ...state.content.spells, spellIDs: value }}})}
                />
            </DocumentEditGroupSection> 

            <DocumentEditGroupSection text="Text" fillScreen={true}>
                <DocumentEditInputSection
                    text="Body"
                    value={state.content.text} 
                    setValue={(value) => setState({ ...state, content: { ...state.content, text: value }})} 
                    multiline={true}
                    fillScreen={true}
                />
            </DocumentEditGroupSection> 
        </div>
    );
}

export default CreEditor;