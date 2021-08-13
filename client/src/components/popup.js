import React from 'react';
import '../styles/popup.css';

const Popup = ({ children, title, enabled, close }) => {
    return ( enabled ?
        <div className={"popupBackground"}>
            <div className={"popup"}>
                <div className={"popupHeader"}>
                    <h4 className={"popupHeaderText"}>
                        {title || "label"}
                    </h4>
                    <div 
                        className={"popupHeaderButton"}
                        onClick={close}
                    > 
                        ✕ 
                    </div>
                </div>
                <div className={"popupBody"}>
                    {children}
                </div>
            </div>
        </div>
        : null
    );
}

export default Popup;