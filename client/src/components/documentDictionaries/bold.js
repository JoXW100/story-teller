import React from 'react';
import "../../styles/document.css";

export const toBoldDictionary = (index) => ({
    "<bold>": { 
        cmp: index,  
        type: "bold", 
        toComponent: (content, index) => <b key={index}> {content} </b>
    },
    "</bold>": { 
        cmp: -index
    }
});