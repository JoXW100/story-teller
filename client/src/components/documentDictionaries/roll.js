import React, { useCallback, useContext, useEffect, useState } from 'react';
import DocumentFunctions from '../../classes/documentFunctions.js';
import { Context } from '../appContext';
import { PopupContext } from '../timedPopup/timedPopupController';
import "../../styles/document.css";

export const toRollDictionary = (index) => ({
    "<roll>": { 
        cmp: index,  
        type: "roll", 
        toComponent: (content, index) => 
            <DocumentRoll 
                key={index} 
                args={DocumentFunctions.contentToArgs(content, 'mod')}
            > 
                {content} 
            </DocumentRoll>
    },
    "</roll>": { 
        cmp: -index
    }
});

const DocumentRoll = ({children, args}) => 
{
    const [mod,  setMod]    = useState(parseInt(args.mod));
    const [dice, setDice]   = useState(parseInt(args.dice));
    const [num,  setNum]    = useState(parseInt(args.num));
    const [isDmg, setIsDmg] = useState(args.isDmg === 'true');
    const [flex, setFlex]   = useState(parseFloat(args.flex));
    const [_, menu] = useContext(Context);
    const [popup] = useContext(PopupContext)

    useEffect(() => {
        setMod(args.mod   ? parseInt(args.mod)  : 0);
        setDice(args.dice ? parseInt(args.dice) : 20);
        setNum(args.num   ? parseInt(args.num)  : 1);
        setIsDmg(args.isDmg === 'true');
        setFlex(args.flex ? parseFloat(args.flex) : -1);
    }, [args]);

    /** 
     * @param {Number} dice The size of the dice
     * @param {Number} num  The number of dice
     * @returns {[Number]} The numbers rolled
    */
    const roll = (dice, num) => {
        let rolls = new Array(num);
        for (let index = 0; index < num; index++) {
            rolls[index] = Math.floor(Math.random() * dice) + 1;
        }
        return rolls;
    }

    /**
     * @param {[Number]} rolls 
     * @returns {[text: String, sum: Number]}
     */
    const rollToResult = (dice, num) => 
    {
        let rolls = roll(dice, num);
        let text = "";
        let sum = 0;
        for (let index = 0; index < rolls.length; index++) {
            if (index == 0) text +=  `(${rolls[index]}`;
            else            text += `, ${rolls[index]}`;
            sum += rolls[index];
        }
        text += `) -> ${sum}`;
        return [text, sum];
    }

    const handleAdvantage = useCallback(() =>
    {
        let header = "Rolled (Advantage):";
        let [text1, sum1] = rollToResult(dice, num);
        let [text2, sum2] = rollToResult(dice, num);
        let max = Math.max(sum1, sum2);
        let text = dice > 0 && mod == 0
            ? `${text1}\n${text2}\nResult: ${max} = ${max + mod}`
            : `${text1}\n${text2}\nResult: ${max} ${mod < 0 ? '-' : '+'} ${Math.abs(mod)} = ${max + mod}`;
        popup.addPopup(<RollPopup header={header} text={text}/>, 4);
    }, [mod, dice, num]);

    const handleDisadvantage = useCallback(() =>
    {
        let header = "Rolled (Disadvantage):";
        let [text1, sum1] = rollToResult(dice, num);
        let [text2, sum2] = rollToResult(dice, num);
        let min = Math.min(sum1, sum2);
        let text = dice > 0 && mod == 0
            ? `${text1}\n${text2}\nResult: ${min} = ${min}`
            : `${text1}\n${text2}\nResult: ${min} ${mod < 0 ? '-' : '+'} ${Math.abs(mod)} = ${min + mod}`;
            popup.addPopup(<RollPopup header={header} text={text}/>, 4);
    }, [mod, dice, num]);

    const handleFlat = useCallback(() =>
    {
        let header = "Rolled:";
        let [text1, sum] = rollToResult(dice, num);
        let text = dice > 0 && mod == 0 
            ? `${text1}\nResult: ${sum} = ${sum}`
            : `${text1}\nResult: ${sum} ${mod < 0 ? '-' : '+'} ${Math.abs(mod)} = ${sum + mod}`;
            popup.addPopup(<RollPopup header={header} text={text}/>, 4);
    }, [mod, dice, num]);

    const handleCrit = useCallback(() =>
    {
        let header = "Rolled (Crit):";
        let [text1, sum1] = rollToResult(dice, num);
        let [text2, sum2] = rollToResult(dice, num);
        let text = dice > 0 && mod == 0 
            ? `${text1}\n${text2}\nResult: ${sum1} + ${sum2} = ${sum1 + sum2}`
            : `${text1}\n${text2}\nResult: ${sum1} + ${sum2} ${mod < 0 ? '-' : '+'} ${Math.abs(mod)} = ${sum1 + sum2 + mod}`;

        popup.addPopup(<RollPopup header={header} text={text}/>, 4);
    }, [mod, dice, num]);

    const onContextMenu = (e) => 
    {
        e.preventDefault();
        menu.set({ active: true, x: e.pageX, y: e.pageY, options: 
            isDmg ? [
                { name: "Flat",         action: handleFlat },
                { name: "Crit",         action: handleCrit }
            ] : [
                { name: "Advantage",    action: handleAdvantage },
                { name: "Disadvantage", action: handleDisadvantage },
                { name: "Flat",         action: handleFlat }
            ]});
    }

    return (
        <div 
            className="documentRoll"
            style={flex ? { flex: flex } : {}}
        > 
            <div> {children} </div>
            <div
                className="documentRollInner"
                onClick={handleFlat}
                onContextMenu={onContextMenu}
            >
                {isDmg ? (mod === 0 ? `${num}d${dice}`
                       : `${num}d${dice} ${mod < 0 ? '-' : '+'} ${Math.abs(mod)}`)
                       : (mod < 0 ? mod : `+${mod}`)}
            </div>
        </div>
    )
}

const RollPopup = ({ text, header }) =>
{
    return (
        <div className="rollPopup">
            {header}
            {text}
        </div>
    )
}

export default DocumentRoll;