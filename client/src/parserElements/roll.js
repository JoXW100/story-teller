import React, { useCallback, useContext, useEffect, useState } from 'react';
import DocumentFunctions from '../classes/documentFunctions.js';
import RollPopup from '../components/diceMenu/rollPopup.js';
import { Context } from '../components/appContext';
import "../styles/document.css";

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
        isDmg: false,
        loading: true,
        content: null
    });

    const { menu, popups } = useContext(Context);

    /**
     * @param {[Number]} rolls 
     * @returns {[text: String, sum: Number]}
     */
    const rollToResult = (dice, num) => 
    {
        if (num === 0) return [`0`, 0];
        let rolls = DocumentFunctions.roll(dice, num);
        let text = "";
        let sum = 0;
        for (let index = 0; index < rolls.length; index++) {
            if (index === 0) text += `(${rolls[index]}`;
            else             text += `, ${rolls[index]}`;
            sum += rolls[index];
        }
        text += `) -> ${sum}`;
        return [text, sum];
    }

    const handleAdvantage = useCallback(() =>
    {
        let header = "Rolled (Advantage):";
        let text = null;
        if (state.num === 0 || state.dice === 0)
        {
            text = "Result: " + state.mod;
        }
        else
        {
            let [text1, sum1] = rollToResult(state.dice, state.num);
            let [text2, sum2] = rollToResult(state.dice, state.num);
            let max = Math.max(sum1, sum2);
            text = state.dice > 0 && state.mod === 0
                ? `${text1}\n${text2}\nResult: ${max} = ${max + state.mod}`
                : `${text1}\n${text2}\nResult: ${max} ${state.mod < 0 ? '-' : '+'} ${Math.abs(state.mod)} = ${max + state.mod}`;
        }
        popups.add(<RollPopup header={header} text={text}/>);
    }, [popups, state]);

    const handleDisadvantage = useCallback(() =>
    {
        let header = "Rolled (Disadvantage):";
        let text = null;
        if (state.num === 0 || state.dice === 0)
        {
            text = "Result: " + state.mod;
        }
        else
        {
            let [text1, sum1] = rollToResult(state.dice, state.num);
            let [text2, sum2] = rollToResult(state.dice, state.num);
            let min = Math.min(sum1, sum2);
            text = state.dice > 0 && state.mod === 0
                ? `${text1}\n${text2}\nResult: ${min} = ${min}`
                : `${text1}\n${text2}\nResult: ${min} ${state.mod < 0 ? '-' : '+'} ${Math.abs(state.mod)} = ${min + state.mod}`;
        }
        
        popups.add(<RollPopup header={header} text={text}/>);
    }, [popups, state]);

    const handleFlat = useCallback(() =>
    {
        let header = "Rolled:";
        let text = null;
        if (state.num === 0 || state.dice === 0)
        {
            text = "Result: " + state.mod;
        }
        else
        {
            let [text1, sum] = rollToResult(state.dice, state.num);
            text = state.dice > 0 && state.mod === 0 
                ? `${text1}\nResult: ${sum} = ${sum}`
                : `${text1}\nResult: ${sum} ${state.mod < 0 ? '-' : '+'} ${Math.abs(state.mod)} = ${sum + state.mod}`;
        }
        popups.add(<RollPopup header={header} text={text}/>);
    }, [popups, state]);

    const handleCrit = useCallback(() =>
    {
        let header = "Rolled (Crit):";
        let text = null;
        if (state.num === 0 || state.dice === 0)
        {
            text = "Result: " + state.mod;
        }
        else
        {
            let [text1, sum1] = rollToResult(state.dice, state.num);
            let [text2, sum2] = rollToResult(state.dice, state.num);
            text = state.dice > 0 && state.mod === 0 
                ? `${text1}\n${text2}\nResult: ${sum1} + ${sum2} = ${sum1 + sum2}`
                : `${text1}\n${text2}\nResult: ${sum1} + ${sum2} ${state.mod < 0 ? '-' : '+'} ${Math.abs(state.mod)} = ${sum1 + sum2 + state.mod}`;
        }
        
        popups.add(<RollPopup header={header} text={text}/>);
    }, [popups, state]);

    const onContextMenu = (e) => 
    {
        e.preventDefault();
        e.stopPropagation();
        menu.show({ x: e.pageX, y: e.pageY }, state.isDmg ? [
            { name: "Flat",         action: handleFlat },
            { name: "Crit",         action: handleCrit }
        ] : [
            { name: "Flat",         action: handleFlat },
            { name: "Advantage",    action: handleAdvantage },
            { name: "Disadvantage", action: handleDisadvantage }
        ]);
    }

    const toText = (args) => 
    {
        if (args.num === 0 || args.dice === 0) return args.mod.toString();
        if (args.isDmg) 
        {
            if (args.mod === 0) return `${args.num}d${args.dice}`;
            else return `${args.num}d${args.dice} ${args.mod < 0 ? '-' : '+'} ${Math.abs(args.mod)}`;
        }
        return `${args.mod < 0 ? '-' : '+'} ${Math.abs(args.mod)}`
    }

    useEffect(() => {
        if (args)
        {
            let res = {
                mod:  args.mod  !== undefined ? parseInt(args.mod)    : 0,
                dice: args.dice !== undefined ? parseInt(args.dice)   : 20,
                flex: args.flex !== undefined ? parseFloat(args.flex) : undefined,
                num:  args.num  !== undefined ? parseInt(args.num)    : 1,
                isDmg: args.isDmg === 'true' || args.isDmg === true,
            }

            setState({
                ...res,
                loading: false,
                content: toText(res)
            });
        }
    }, [args]);

    return state.loading ? null : (
        <div 
            className="documentRoll"
            style={state.flex ? { flex: state.flex } : {}}
        > 
            <div> {children} </div>
            <div
                className="documentRollInner"
                onClick={(e) => e.currentTarget === e.target && (e.stopPropagation() & handleFlat())}
                onContextMenu={onContextMenu}
            >
                { state.content }
            </div>
        </div>
    )
}

export default DocumentRoll;