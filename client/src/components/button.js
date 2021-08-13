import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/button.css';

export const ButtonType = {
    Normal: 0,
    Small: 1,
    Round: 2,
    SmallRound: 3,
    Last: 4
}

const Button = ({ onClick, children, disabled = false, type = ButtonType.Normal,  to }) => 
{
    const typeToClass = () => {
        switch (type) 
        {
            case ButtonType.Small:
                return disabled? "button small disabled" : "button small";

            case ButtonType.Round:
                return disabled? "button round disabled" : "button round";

            case ButtonType.SmallRound:
                return disabled? "button small round disabled" : "button small round";

            case ButtonType.Last:
                return disabled? "button last disabled": "button last";

            default:
                return disabled? "button disabled" : "button";
        }
    }

    return ( to && !disabled ?
        <Link 
            className={"button"}
            onClick={onClick}
            to={to}
            draggable={false}
        >
            {children || "label"}
        </Link>
        :
        <div 
            className={typeToClass()}
            onClick={!disabled && onClick ? onClick : null}
        >
            {children || "label"}
        </div>
    );
}

export default Button;