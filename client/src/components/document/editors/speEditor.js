import React, { useEffect, useState } from 'react';
import DocumentEditGroupSection from '../documentComponents/documentEditGroupSection';
import DocumentEditInputSection from '../documentComponents/documentEditInputSection';

/**
 * @param {{ document: DBFile, save: (update: Object<string, *>, callback: (response: {}) => void) => void}} 
 * @returns {React.Component}
 */
const SpeEditor = ({ document, save }) => 
{
    /** 
     * @type {[ 
     *  state: { 
     *      content: DBSpellFileContent, 
     *      isSaving: boolean, 
     *      isQueued: boolean
     *  }, setState: () => void]} 
     * 
    */
    const [state, setState] = useState({ 
        content: document.content,
        loading: true
    });

    useEffect(() => 
    {
        setState({ 
            content: document.content,
            loading: true
        });
    }, [document]);

    useEffect(() => 
    {
        if (state.loading) setState({ ...state, loading: false });
        else save({ content: state.content });
    }, [state.content]);

    return (
        <div className="editBackground">
            <DocumentEditGroupSection text="Info">
                <DocumentEditInputSection 
                    text="Name"
                    value={state.content.name} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, name: x }})}
                />
                <DocumentEditInputSection 
                    text="Level"
                    value={state.content.level}
                    type='number'
                    setValue={(x) => setState({ ...state, content: { ...state.content, level: x }})}
                />
                <DocumentEditInputSection 
                    text="Casting Time"
                    value={state.content.castingTime} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, castingTime: x }})}
                />
                <DocumentEditInputSection 
                    text="Condition Type"
                    value={state.content.conditionType} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, conditionType: x }})}
                />
                <DocumentEditInputSection 
                    text="Save Attribute"
                    value={state.content.saveAttribute} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, saveAttribute: x }})}
                />
                <DocumentEditInputSection 
                    text="School"
                    value={state.content.school} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, school: x }})}
                />
                <DocumentEditInputSection 
                    text="Duration"
                    value={state.content.duration} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, duration: x }})}
                />
                <DocumentEditInputSection 
                    text="Components"
                    value={state.content.components} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, components: x }})}
                />
                <DocumentEditInputSection 
                    text="Concentration"
                    value={state.content.concentration}
                    type='checkbox'
                    setValue={(x) => setState({ ...state, content: { ...state.content, concentration: x }})}
                />
                <DocumentEditInputSection 
                    text="Description"
                    value={state.content.shortText} 
                    multiline={true}
                    setValue={(x) => setState({ ...state, content: { ...state.content, shortText: x }})}
                />
                <DocumentEditGroupSection text="Roll">
                    <DocumentEditInputSection 
                        text="Scaling"
                        value={state.content.roll.scalingModifier} 
                        setValue={(x) => setState({ ...state, content: { ...state.content, roll: { ...state.content.roll, scalingModifier: x }}})}
                    />
                    <DocumentEditInputSection 
                        text="Proficiency"
                        type='number'
                        value={state.content.roll.proficiency} 
                        setValue={(x) => setState({ ...state, content: { ...state.content, roll: { ...state.content.roll, proficiency: parseInt(x) }}})}
                    />
                    <DocumentEditInputSection 
                        text="Base Modifier"
                        type='number'
                        value={state.content.roll.baseModifier} 
                        setValue={(x) => setState({ ...state, content: { ...state.content, roll: { ...state.content.roll, baseModifier: parseInt(x) }}})}
                    />
                    <DocumentEditInputSection 
                        text="Dice Size"
                        type='number'
                        value={state.content.roll.diceSize} 
                        setValue={(x) => setState({ ...state, content: { ...state.content, roll: { ...state.content.roll, diceSize: parseInt(x) }}})}
                    />
                    <DocumentEditInputSection 
                        text="Dice Num"
                        type='number'
                        value={state.content.roll.diceNum} 
                        setValue={(x) => setState({ ...state, content: {...state.content, roll: { ...state.content.roll, diceNum: parseInt(x) }}})}
                    />
                </DocumentEditGroupSection>
            </DocumentEditGroupSection>

            <DocumentEditGroupSection text="Effect">
                <DocumentEditInputSection 
                    text="Type"
                    value={state.content.effect.type} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, effect: { ...state.content.effect, type: x }}})}
                />
                <DocumentEditInputSection 
                    text="Damage"
                    value={state.content.effect.dmg} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, effect: { ...state.content.effect, dmg: x }}})}
                />
                <DocumentEditInputSection 
                    text="Area"
                    value={state.content.effect.area} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, effect: { ...state.content.effect, area: x }}})}
                />
                <DocumentEditInputSection 
                    text="Range"
                    value={state.content.effect.range} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, effect: { ...state.content.effect, range: x }}})}
                />
                <DocumentEditInputSection 
                    text="Success Effect"
                    value={state.content.effect.successEffect} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, effect: { ...state.content.effect, successEffect: x }}})} 
                    multiline={true}
                />
                <DocumentEditInputSection 
                    text="Fail Effect"
                    value={state.content.effect.failEffect} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, effect: { ...state.content.effect, failEffect: x }}})} 
                    multiline={true}
                />

                <DocumentEditGroupSection text="Roll">
                    <DocumentEditInputSection 
                        text="Scaling"
                        value={state.content.effect.roll.scalingModifier} 
                        setValue={(x) => setState({ ...state, content: { ...state.content, effect: { ...state.content.effect, roll: { ...state.content.effect.roll, scalingModifier: x }}}})}
                    />
                    <DocumentEditInputSection 
                        text="Proficiency"
                        type='number'
                        value={state.content.effect.roll.proficiency} 
                        setValue={(x) => setState({ ...state, content: { ...state.content, effect: { ...state.content.effect, roll: { ...state.content.effect.roll, proficiency: parseInt(x) }}}})}
                    />
                    <DocumentEditInputSection 
                        text="Base Modifier"
                        type='number'
                        value={state.content.effect.roll.baseModifier} 
                        setValue={(x) => setState({ ...state, content: { ...state.content, effect: { ...state.content.effect, roll: { ...state.content.effect.roll, baseModifier: parseInt(x) }}}})}
                    />
                    <DocumentEditInputSection 
                        text="Dice Size"
                        type='number'
                        value={state.content.effect.roll.diceSize} 
                        setValue={(x) => setState({ ...state, content: { ...state.content, effect: { ...state.content.effect, roll: { ...state.content.effect.roll, diceSize: parseInt(x) }}}})}
                    />
                    <DocumentEditInputSection 
                        text="Dice Num"
                        type='number'
                        value={state.content.effect.roll.diceNum} 
                        setValue={(x) => setState({ ...state, content: { ...state.content, effect: { ...state.content.effect, roll: { ...state.content.effect.roll, diceNum: parseInt(x) }}}})}
                    />
                </DocumentEditGroupSection>
            </DocumentEditGroupSection>

            <DocumentEditGroupSection text="Text" fillScreen={true}>
                <DocumentEditInputSection
                    text="Body" 
                    value={state.content.text} 
                    setValue={(x) => setState({ ...state, content: { ...state.content, text: x }})} 
                    multiline={true}
                    fillScreen={true}
                />
            </DocumentEditGroupSection> 
        </div>
    );
}

export default SpeEditor;