import React, { useContext, useState } from 'react';
import DocumentFunctions from '../../classes/documentFunctions';
import DiceButton from './diceButton';
import RollPopup from './rollPopup';
import { CloseCross } from '../icons';
import { Context } from '../appContext';

const DiceMenu = ({ hide }) => 
{
    const { popups } = useContext(Context)
    const [selection, setSelection] = useState({
        4: 0, 6: 0, 8: 0, 10: 0, 12: 0, 20: 0, 100: 0
    });

    const onDicePress = (dice) => 
    {
        setSelection({...selection, [dice]: selection[dice] + 1 })
    } 

    const roll = () => 
    {
        let rolls = [];
        let newSelection = {...selection};
        
        Object.keys(newSelection).forEach((key) =>
        { 
            if (newSelection[key] > 0)
            {
                rolls.push(DocumentFunctions.roll(parseInt(key), newSelection[key]));
            }

            newSelection[key] = 0;
        });

        rolls = rolls.flat(1)

        let text1 = "";
        let sum = 0;
        for (let index = 0; index < rolls.length; index++) {
            if (index == 0) text1 += `(${rolls[index]}`;
            else            text1 += `, ${rolls[index]}`;
            sum += rolls[index];
        }
        text1 += `) -> ${sum}`;

        let header = "Rolled (Custom):";
        let text = `${text1}\nResult: ${sum}`;

        popups.add(<RollPopup header={header} text={text}/>);
        setSelection(newSelection)
    }

    return (
        <div className="diceMenu">
            <div className="diceHolder">
                {Object.keys(selection)
                .sort((a, b) => parseInt(b) - parseInt(a))
                .map((key, index) => (
                    <DiceButton 
                        key={index} 
                        dice={key} 
                        num={selection[key]}
                        onClick={onDicePress}
                    />
                ))}
            </div>
            <div className="diceToolbar">
                <div className="diceButton" onClick={hide}> <CloseCross/> </div>
                { Object.values(selection).some((num) => num > 0) &&
                    <div 
                        className="diceToolbarText"
                        onClick={roll}
                    > 
                        Roll 
                    </div>
                }
            </div>
        </div>
    )
}

export default DiceMenu;