import React from 'react';
import "../../styles/document.css";

export const toHeader4Dictionary = (index) => ({
    "<h4>": { 
        cmp: index,  
        type: "header4", 
        toComponent: (content, index) => (
            <div className="documentHeader4" key={index}> 
                {content} 
            </div>
        )
    },
    "</h4>": { 
        cmp: -index 
    }
});