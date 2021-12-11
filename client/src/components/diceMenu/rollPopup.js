import React from 'react';

const RollPopup = ({ text, header }) =>
{
    return (
        <div className="rollPopup">
            {header + '\n' + text}
        </div>
    )
}

export default RollPopup;