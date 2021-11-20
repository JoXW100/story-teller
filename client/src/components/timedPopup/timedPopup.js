import React, { useEffect } from 'react';
import '../../styles/timedPopup.css';

const TimedPopup = ({children, duration, startTime, onDone}) =>
{
    useEffect(() => 
    {
        let id = setTimeout(() => onDone(startTime), 1000 * duration);

        return () => clearTimeout(id);
    }, [])

    return (
        <div className="timedPopup">
            {children}
        </div>
    );
}

export default TimedPopup;