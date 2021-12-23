import React, { useEffect, useState } from 'react';
import Server from '../../../server/server';
import DocumentEditGroupSection from '../documentComponents/documentEditGroupSection';
import DocumentEditInputSection from '../documentComponents/documentEditInputSection';

/**
 * 
 * @param {{ document: DBFile }} 
 * @returns 
 */
const AbiEditor = ({ document, onChange }) => 
{
    /** @type {[content: DBAbilityFileContent, setContent: (content: DBAbilityFileContent) => void]} */
    const [content, setContent] = useState(document.content);
    const [isSaving, setIsSaving] = useState(false);
    const [savingQueue, setSavingQueue] = useState(false);

    useEffect(() => 
    {
        if (document)
        {
            setContent(document.content);
            setSavingQueue(false);
            setIsSaving(false);
        }
    }, [document])
    
    useEffect(() => 
    {
        const save = (override = false) => 
        {
            if (isSaving)
            {
                setSavingQueue(!override);
            }
            if (!isSaving || override)
            {
                Server.files.update(document._id, { content: content })
                .catch(console.error())
                .finally(() => (savingQueue && save(override = true) & setIsSaving(false)))
                .then((response) => {
                    if (!response) console.error("Failed Saving");
                    if (savingQueue)
                    {
                        setSavingQueue(false);
                        save();
                    }
                    onChange();
                });
            }
        }
        save();
    }, [content]);

    return (
        <div className="editBackground">
            <DocumentEditGroupSection text="Info">
                <DocumentEditInputSection 
                    text="Name"
                    value={content.name} 
                    setValue={(value) => setContent({ ...content, name: value })}
                />
                <DocumentEditInputSection 
                    text="Ability Type"
                    value={content.abilityType} 
                    setValue={(value) => setContent({ ...content, abilityType: value })}
                />
                <DocumentEditInputSection 
                    text="Action Type"
                    value={content.actionType} 
                    setValue={(value) => setContent({ ...content, actionType: value })}
                />
                <DocumentEditInputSection 
                    text="Notes"
                    value={content.notes} 
                    setValue={(value) => setContent({ ...content, notes: value })}
                />
                <DocumentEditInputSection 
                    text="Charges"
                    type='number'
                    value={content.charges}
                    setValue={(value) => setContent({ ...content, charges: parseInt(value) })}
                />
                <DocumentEditInputSection 
                    text="Charge Reset"
                    value={content.chargeReset} 
                    setValue={(value) => setContent({ ...content, chargeReset: value })}
                />
                <DocumentEditInputSection 
                    text="Description"
                    value={content.shortText} 
                    setValue={(value) => setContent({ ...content, shortText: value })} 
                    multiline={true}
                />

                <DocumentEditGroupSection text="Roll">
                    <DocumentEditInputSection 
                        text="Scaling"
                        value={content.roll.scalingModifier} 
                        setValue={(value) => setContent({ ...content, roll: { ...(content.roll), scalingModifier: value }})}
                    />
                    <DocumentEditInputSection 
                        text="Proficiency"
                        type='number'
                        value={content.roll.proficiency} 
                        setValue={(value) => setContent({ ...content, roll: { ...(content.roll), proficiency: parseInt(value) }})}
                    />
                    <DocumentEditInputSection 
                        text="Base Modifier"
                        type='number'
                        value={content.roll.baseModifier} 
                        setValue={(value) => setContent({ ...content, roll: { ...(content.roll), baseModifier: parseInt(value) }})}
                    />
                    <DocumentEditInputSection 
                        text="Dice Size"
                        type='number'
                        value={content.roll.diceSize} 
                        setValue={(value) => setContent({ ...content, roll: { ...(content.roll), diceSize: parseInt(value) }})}
                    />
                    <DocumentEditInputSection 
                        text="Dice Num"
                        type='number'
                        value={content.roll.diceNum} 
                        setValue={(value) => setContent({ ...content, roll: { ...(content.roll), diceNum: parseInt(value) }})}
                    />
                </DocumentEditGroupSection>
            </DocumentEditGroupSection>

            <DocumentEditGroupSection text="Effect">
                <DocumentEditInputSection 
                    text="Type"
                    value={content.effect.type} 
                    setValue={(value) => setContent({ ...content, effect: { ...(content.effect), type: value }})}
                />
                <DocumentEditInputSection 
                    text="Range"
                    value={content.effect.range} 
                    setValue={(value) => setContent({ ...content, effect: { ...(content.effect), range: value }})}
                />
                <DocumentEditInputSection 
                    text="Success Effect"
                    value={content.effect.successEffect} 
                    setValue={(value) => setContent({ ...content, effect: { ...(content.effect), successEffect: value }})} 
                    multiline={true}
                />
                <DocumentEditInputSection 
                    text="Fail Effect"
                    value={content.effect.failEffect} 
                    setValue={(value) => setContent({ ...content, effect: { ...(content.effect), failEffect: value }})} 
                    multiline={true}
                />

                <DocumentEditGroupSection text="Roll">
                    <DocumentEditInputSection 
                        text="Scaling"
                        value={content.effect.roll.scalingModifier} 
                        setValue={(value) => setContent({ ...content, effect: { ...(content.effect), roll: { ...(content.effect.roll), scalingModifier: value }}})}
                    />
                    <DocumentEditInputSection 
                        text="Proficiency"
                        type='number'
                        value={content.effect.roll.proficiency} 
                        setValue={(value) => setContent({ ...content, effect: { ...(content.effect), roll: { ...(content.effect.roll), proficiency: parseInt(value) }}})}
                    />
                    <DocumentEditInputSection 
                        text="Base Modifier"
                        type='number'
                        value={content.effect.roll.baseModifier} 
                        setValue={(value) => setContent({ ...content, effect: { ...(content.effect), roll: { ...(content.effect.roll), baseModifier: parseInt(value) }}})}
                    />
                    <DocumentEditInputSection 
                        text="Dice Size"
                        type='number'
                        value={content.effect.roll.diceSize} 
                        setValue={(value) => setContent({ ...content, effect: { ...(content.effect), roll: { ...(content.effect.roll), diceSize: parseInt(value) }}})}
                    />
                    <DocumentEditInputSection 
                        text="Dice Num"
                        type='number'
                        value={content.effect.roll.diceNum} 
                        setValue={(value) => setContent({ ...content, effect: { ...(content.effect), roll: { ...(content.effect.roll), diceNum: parseInt(value) }}})}
                    />
                </DocumentEditGroupSection>
            </DocumentEditGroupSection>

            <DocumentEditGroupSection text="Text" fillScreen={true}>
                <DocumentEditInputSection
                    text="Body"
                    value={content.text} 
                    setValue={(value) => setContent({ ...content, text: value })} 
                    multiline={true}
                    fillScreen={true}
                />
            </DocumentEditGroupSection> 
        </div>
    );
}

export default AbiEditor;