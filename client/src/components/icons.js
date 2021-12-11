import React from 'react';
import { ReactComponent as D100SVG } from '../assets/dice/D100.svg';
import { ReactComponent as D20SVG } from '../assets/dice/D20.svg';
import { ReactComponent as D12SVG } from '../assets/dice/D12.svg';
import { ReactComponent as D10SVG } from '../assets/dice/D10.svg';
import { ReactComponent as D8SVG } from '../assets/dice/D8.svg';
import { ReactComponent as D6SVG } from '../assets/dice/D6.svg';
import { ReactComponent as D4SVG } from '../assets/dice/D4.svg';
import { ReactComponent as CloseCrossSVG } from '../assets/closeCross.svg';
import '../styles/dice.css';

export const D100 = () => (
    <D100SVG className="dice d100"/>
);

export const D20 = () => (
    <D20SVG className="dice d20"/>
);

export const D12 = () => (
    <D12SVG className="dice d12"/>
);

export const D10 = () => (
    <D10SVG className="dice d10"/>
);

export const D8 = () => (
    <D8SVG className="dice d8"/>
);

export const D6 = () => (
    <D6SVG className="dice d6"/>
);

export const D4 = () => (
    <D4SVG className="dice d4"/>
);

export const CloseCross = () => (
    <CloseCrossSVG className="closeCross"/>
);