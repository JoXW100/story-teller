import React from 'react';
import { D100, D20, D12, D10, D8, D6, D4 } from '../icons';

const DiceButton = ({ dice, num, onClick }) => {

    const translateArray = {
        100: <D100/>,
        20:  <D20/>,
        12:  <D12/>,
        10:  <D10/>,
        8:   <D8/>,
        6:   <D6/>,
        4:   <D4/> 
    }

    return (
        <div className="diceButton" onClick={() => onClick(dice)}> 
            {translateArray[dice]}
            { num > 0 &&
                <div className="diceNum"> 
                    {num}
                </div>
            }
        </div>
    );
}

export default DiceButton;