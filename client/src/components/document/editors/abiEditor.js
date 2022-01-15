import React, { useEffect, useState } from 'react';
import DocumentEditGroupSection from '../documentComponents/documentEditGroupSection';
import DocumentEditInputSection from '../documentComponents/documentEditInputSection';

/**
 * @param {{ document: DBFile, save: (update: Object<string, *>, callback: (response: {}) => void) => void}} 
 * @returns {React.Component}
 */
const AbiEditor = ({ document, save }) => 
{
    /** @type {[ state: { content: DBAbilityFileContent, loading: boolean }, setContent: (content: DBAbilityFileContent) => void]} */
    const [state, setValue] = useState({ content: document.content, loading: true });

    useEffect(() => 
    {
        setValue({ 
            content: document.content, 
            loading: true
        });
    }, [document]);
    
    useEffect(() => 
    {
        if (state.loading) setValue({ ...state, loading: false });
        else save({ content: state.content });
    }, [state.content]);

    return (
        <div className="editBackground">
            <DocumentEditGroupSection text="Info">
                <DocumentEditInputSection 
                    text="Name"
                    value={state.content.name} 
                    setValue={(value) => setValue({ ...state, content: { ...state.content, name: value }})}
                />
                <DocumentEditInputSection 
                    text="Ability Type"
                    value={state.content.abilityType} 
                    setValue={(value) => setValue({ ...state, content: { ...state.content, abilityType: value }})}
                />
                <DocumentEditInputSection 
                    text="Action Type"
                    value={state.content.actionType} 
                    setValue={(value) => setValue({ ...state, content: { ...state.content, actionType: value }})}
                />
                <DocumentEditInputSection 
                    text="Condition Type"
                    value={state.content.conditionType} 
                    setValue={(value) => setValue({ ...state, content: { ...state.content, conditionType: value }})}
                />
                <DocumentEditInputSection 
                    text="Save Attribute"
                    value={state.content.saveAttribute} 
                    setValue={(value) => setValue({ ...state, content: { ...state.content, saveAttribute: value }})}
                />
                <DocumentEditInputSection 
                    text="Notes"
                    value={state.content.notes} 
                    setValue={(value) => setValue({ ...state, content: { ...state.content, notes: value }})}
                />
                <DocumentEditInputSection 
                    text="Charges"
                    type='number'
                    value={state.content.charges}
                    setValue={(value) => setValue({ ...state, content: { ...state.content, charges: parseInt(value) }})}
                />
                <DocumentEditInputSection 
                    text="Charge Reset"
                    value={state.content.chargeReset} 
                    setValue={(value) => setValue({ ...state, content: { ...state.content, chargeReset: value }})}
                />
                <DocumentEditInputSection 
                    text="Description"
                    value={state.content.shortText} 
                    setValue={(value) => setValue({ ...state, content: { ...state.content, shortText: value }})} 
                    multiline={true}
                />

                <DocumentEditGroupSection text="Roll">
                    <DocumentEditInputSection 
                        text="Scaling"
                        value={state.content.roll.scalingModifier} 
                        setValue={(value) => setValue({ ...state, content: { ...state.content, roll: { ...state.content.roll, scalingModifier: value }}})}
                    />
                    <DocumentEditInputSection 
                        text="Proficiency"
                        type='number'
                        value={state.content.roll.proficiency} 
                        setValue={(value) => setValue({ ...state, content: { ...state.content, roll: { ...state.content.roll, proficiency: parseInt(value) }}})}
                    />
                    <DocumentEditInputSection 
                        text="Base Modifier"
                        type='number'
                        value={state.content.roll.baseModifier} 
                        setValue={(value) => setValue({ ...state, content: { ...state.content, roll: { ...state.content.roll, baseModifier: parseInt(value) }}})}
                    />
                    <DocumentEditInputSection 
                        text="Dice Size"
                        type='number'
                        value={state.content.roll.diceSize} 
                        setValue={(value) => setValue({ ...state, content: { ...state.content, roll: { ...state.content.roll, diceSize: parseInt(value) }}})}
                    />
                    <DocumentEditInputSection 
                        text="Dice Num"
                        type='number'
                        value={state.content.roll.diceNum} 
                        setValue={(value) => setValue({ ...state, content: { ...state.content, roll: { ...state.content.roll, diceNum: parseInt(value) }}})}
                    />
                </DocumentEditGroupSection>
            </DocumentEditGroupSection>

            <DocumentEditGroupSection text="Effect">
                <DocumentEditInputSection 
                    text="Type"
                    value={state.content.effect.type} 
                    setValue={(value) => setValue({ ...state, content: { ...state.content, effect: { ...(state.content.effect), type: value }}})}
                />
                <DocumentEditInputSection 
                    text="Range"
                    value={state.content.effect.range} 
                    setValue={(value) => setValue({ ...state, content: { ...state.content, effect: { ...(state.content.effect), range: value }}})}
                />
                <DocumentEditInputSection 
                    text="Success Effect"
                    value={state.content.effect.successEffect} 
                    setValue={(value) => setValue({ ...state, content: { ...state.content, effect: { ...(state.content.effect), successEffect: value }}})} 
                    multiline={true}
                />
                <DocumentEditInputSection 
                    text="Fail Effect"
                    value={state.content.effect.failEffect} 
                    setValue={(value) => setValue({ ...state, content: { ...state.content, effect: { ...(state.content.effect), failEffect: value }}})} 
                    multiline={true}
                />

                <DocumentEditGroupSection text="Roll">
                    <DocumentEditInputSection 
                        text="Scaling"
                        value={state.content.effect.roll.scalingModifier} 
                        setValue={(value) => setValue({ ...state, content: { ...state.content, effect: { ...(state.content.effect), roll: { ...state.content.effect.roll, scalingModifier: value }}}})}
                    />
                    <DocumentEditInputSection 
                        text="Proficiency"
                        type='number'
                        value={state.content.effect.roll.proficiency} 
                        setValue={(value) => setValue({ ...state, content: { ...state.content, effect: { ...(state.content.effect), roll: { ...state.content.effect.roll, proficiency: parseInt(value) }}}})}
                    />
                    <DocumentEditInputSection 
                        text="Base Modifier"
                        type='number'
                        value={state.content.effect.roll.baseModifier} 
                        setValue={(value) => setValue({ ...state, content: { ...state.content, effect: { ...(state.content.effect), roll: { ...state.content.effect.roll, baseModifier: parseInt(value) }}}})}
                    />
                    <DocumentEditInputSection 
                        text="Dice Size"
                        type='number'
                        value={state.content.effect.roll.diceSize} 
                        setValue={(value) => setValue({ ...state, content: { ...state.content, effect: { ...(state.content.effect), roll: { ...state.content.effect.roll, diceSize: parseInt(value) }}}})}
                    />
                    <DocumentEditInputSection 
                        text="Dice Num"
                        type='number'
                        value={state.content.effect.roll.diceNum} 
                        setValue={(value) => setValue({ ...state, content: { ...state.content, effect: { ...(state.content.effect), roll: { ...state.content.effect.roll, diceNum: parseInt(value) }}}})}
                    />
                </DocumentEditGroupSection>
            </DocumentEditGroupSection>

            <DocumentEditGroupSection text="Text" fillScreen={true}>
                <DocumentEditInputSection
                    text="Body"
                    value={state.content.text} 
                    setValue={(value) => setValue({ ...state, content: { ...state.content, text: value }})} 
                    multiline={true}
                    fillScreen={true}
                />
            </DocumentEditGroupSection> 
        </div>
    );
}

export default AbiEditor;