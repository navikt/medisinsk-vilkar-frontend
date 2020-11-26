import React from 'react';
import Lenke from 'nav-frontend-lenker';

interface InteractiveListElement {
    elementRenderer: (el: InteractiveListElement) => React.ReactNode;
    [key: string]: any;
}

interface InteractiveListProps {
    elements: InteractiveListElement[];
    onElementClick: (element: InteractiveListElement) => void;
}

const InteractiveList = ({ elements, onElementClick }: InteractiveListProps) => (
    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {elements.map((element, i) => (
            <li style={{ marginTop: '0.5rem' }} key={`${i}`}>
                <Lenke
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onElementClick(element);
                    }}
                >
                    {element.elementRenderer(element)}
                </Lenke>
            </li>
        ))}
    </ul>
);

export default InteractiveList;
