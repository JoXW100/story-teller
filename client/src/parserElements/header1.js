import React from 'react';
import "../styles/document.css";

export const toHeader1Dictionary = (index) => ({
    "<h1>": { 
        cmp: index,  
        type: "header1", 
        toComponent: (content, index) => (
            <div className="documentHeader1" key={index}> 
                {content} 
            </div>
        )
    },
    "</h1>": { 
        cmp: -index 
    }
});