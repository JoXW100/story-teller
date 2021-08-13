import React from 'react';
import "../../styles/document.css";

export const toHeader2Dictionary = (index) => ({
    "<h2>": { 
        cmp: index,  
        type: "header2", 
        toComponent: (content, index) => (
            <div className="documentHeader2" key={index}> 
                {content} 
            </div>
        )
    },
    "</h2>": { 
        cmp: -index 
    }
});