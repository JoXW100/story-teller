import React, { useCallback, useContext, useEffect, useState } from 'react';
import DocumentFunctions from '../../classes/documentFunctions.js';
import RollPopup from '../diceMenu/rollPopup.js';
import { Context } from '../appContext';
import { PopupContext } from '../timedPopup/timedPopupController';
import "../../styles/document.css";

export const toRollDictionary = (index) => ({
    "<roll>": { 
        cmp: index,  
        type: "roll", 
        toComponent: (content, index) => (
            <DocumentRoll 
                key={index} 
                args={DocumentFunctions.contentToArgs(content, 'mod')}
            > 
                {content} 
            </DocumentRoll>
        )
    },
    "</roll>": { 
        cmp: -index
    }
});

const DocumentRoll = ({children, args}) => 
{
    const [state, setState] = useState({
        mod: 0,
        dice: 20,
        num: 1,
        flex: undefined,
        isDmg: false
    });

    const [_, menu] = useContext(Context);
    const [popup] = useContext(PopupContext);

    useEffect(() => {
        setState({
            mod:  args.mod  ? parseInt(args.mod)    : 0,
            dice: args.dice ? parseInt(args.dice)   : 20,
            num:  args.num  ? parseInt(args.num)    : 1,
            flex: args.flex ? parseFloat(args.flex) : undefined,
            isDmg: args.isDmg === 'true'
        });
    }, [args]);

    /**
     * @param {[Number]} rolls 
     * @returns {[text: String, sum: Number]}
     */
    const rollToResult = (dice, num) => 
    {
        let rolls = DocumentFunctions.roll(dice, num);
        let text = "";
        let sum = 0;
        for (let index = 0; index < rolls.length; index++) {
            if (index === 0) text += `(${rolls[index]}`;
            else            text += `, ${rolls[index]}`;
            sum += rolls[index];
        }
        text += `) -> ${sum}`;
        return [text, sum];
    }

    const handleAdvantage = useCallback(() =>
    {
        let header = "Rolled (Advantage):";
        let [text1, sum1] = rollToResult(state.dice, state.num);
        let [text2, sum2] = rollToResult(state.dice, state.num);
        let max = Math.max(sum1, sum2);
        let text = state.dice > 0 && state.mod === 0
            ? `${text1}\n${text2}\nResult: ${max} = ${max + state.mod}`
            : `${text1}\n${text2}\nResult: ${max} ${state.mod < 0 ? '-' : '+'} ${Math.abs(state.mod)} = ${max + state.mod}`;
        popup.addPopup(<RollPopup header={header} text={text}/>, 4);
    }, [state]);

    const handleDisadvantage = useCallback(() =>
    {
        let header = "Rolled (Disadvantage):";
        let [text1, sum1] = rollToResult(state.dice, state.num);
        let [text2, sum2] = rollToResult(state.dice, state.num);
        let min = Math.min(sum1, sum2);
        let text = state.dice > 0 && state.mod === 0
            ? `${text1}\n${text2}\nResult: ${min} = ${min}`
            : `${text1}\n${text2}\nResult: ${min} ${state.mod < 0 ? '-' : '+'} ${Math.abs(state.mod)} = ${min + state.mod}`;
            popup.addPopup(<RollPopup header={header} text={text}/>, 4);
    }, [state]);

    const handleFlat = useCallback(() =>
    {
        let header = "Rolled:";
        let [text1, sum] = rollToResult(state.dice, state.num);
        let text = state.dice > 0 && state.mod === 0 
            ? `${text1}\nResult: ${sum} = ${sum}`
            : `${text1}\nResult: ${sum} ${state.mod < 0 ? '-' : '+'} ${Math.abs(state.mod)} = ${sum + state.mod}`;
            popup.addPopup(<RollPopup header={header} text={text}/>, 4);
    }, [state]);

    const handleCrit = useCallback(() =>
    {
        let header = "Rolled (Crit):";
        let [text1, sum1] = rollToResult(state.dice, state.num);
        let [text2, sum2] = rollToResult(state.dice, state.num);
        let text = state.dice > 0 && state.mod === 0 
            ? `${text1}\n${text2}\nResult: ${sum1} + ${sum2} = ${sum1 + sum2}`
            : `${text1}\n${text2}\nResult: ${sum1} + ${sum2} ${state.mod < 0 ? '-' : '+'} ${Math.abs(state.mod)} = ${sum1 + sum2 + state.mod}`;

        popup.addPopup(<RollPopup header={header} text={text}/>, 4);
    }, [state]);

    const onContextMenu = (e) => 
    {
        e.preventDefault();
        menu.set({ active: true, x: e.pageX, y: e.pageY, options: 
            state.isDmg ? [
                { name: "Flat",         action: handleFlat },
                { name: "Crit",         action: handleCrit }
            ] : [
                { name: "Flat",         action: handleFlat },
                { name: "Advantage",    action: handleAdvantage },
                { name: "Disadvantage", action: handleDisadvantage }
            ]});
    }

    return (
        <div 
            className="documentRoll"
            style={state.flex ? { flex: state.flex } : {}}
        > 
            <div> {children} </div>
            <div
                className="documentRollInner"
                onClick={handleFlat}
                onContextMenu={onContextMenu}
            >
                {state.isDmg ? (state.mod === 0 ? `${state.num}d${state.dice}`
                    : `${state.num}d${state.dice} ${state.mod < 0 ? '-' : '+'} ${Math.abs(state.mod)}`)
                    : (state.mod < 0 ? state.mod : `+${state.mod}`)}
            </div>
        </div>
    )
}

export default DocumentRoll;