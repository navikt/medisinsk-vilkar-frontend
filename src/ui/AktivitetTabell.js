import React from 'react';

const AktivitetTabell = ({ columnHeaders, children }) => {
    return (
        <div className="aktivitetTabell" role="table">
            <div className="aktivitetTabell__thead" role="row-group">
                {columnHeaders.map((columnHeader) => (
                    <div className="aktivitetTabell__th">{columnHeader}</div>
                ))}
            </div>
            {React.Children.map(children, (child) => {
                if (child.type === AktivitetTabell.Row) {
                    return React.cloneElement(child);
                }
            })}
        </div>
    );
};

AktivitetTabell.Row = ({ isActive, onButtonClick, renderWhenActive, children }) => {
    const rowCls = isActive
        ? 'aktivitetTabell__tr aktivitetTabell__tr--active'
        : 'aktivitetTabell__tr';
    const rowContent = (
        <div className={rowCls} role="row">
            {children}
            <div className="aktivitetTabell__tr__btnContainer">
                <div className="aktivitetTabell__tr__btnContainer__btn">
                    <button onClick={onButtonClick}>
                        {isActive ? 'Lukk skjema' : 'Åpne skjema'}
                    </button>
                </div>
            </div>
        </div>
    );

    if (isActive) {
        return [rowContent, renderWhenActive()];
    }

    return rowContent;
};

AktivitetTabell.Column = ({ children }) => {
    return (
        <div className="aktivitetTabell__td" role="cell">
            {children}
        </div>
    );
};

export default AktivitetTabell;
