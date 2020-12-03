import React from 'react';
import classnames from 'classnames';
import styles from './interactiveList.less';

export interface InteractiveListElement {
    contentRenderer: (el: InteractiveListElement) => React.ReactNode;
    onClick: (el: InteractiveListElement) => void;
    active?: boolean;
}

interface InteractiveListProps {
    elements: InteractiveListElement[];
}

const InteractiveListElement = (props: InteractiveListElement) => {
    const { contentRenderer, onClick, active } = props;
    const cls = classnames(styles.interactiveListElement, {
        [styles['interactiveListElement--active']]: active === true,
    });
    return (
        <li className={cls}>
            <button className={styles.interactiveListElement__button} type="button" onClick={() => onClick(props)}>
                {contentRenderer(props)}
            </button>
        </li>
    );
};

const InteractiveList = ({ elements }: InteractiveListProps) => {
    const [activeElement, setActiveElement] = React.useState(null);
    return (
        <ul className={styles.interactiveList}>
            {elements.map((elementProps, index) => (
                <InteractiveListElement
                    {...elementProps}
                    active={activeElement === index}
                    onClick={() => {
                        elementProps.onClick(elementProps);
                        setActiveElement(index);
                    }}
                />
            ))}
        </ul>
    );
};

export default InteractiveList;
