import React from 'react';
import Chevron from 'nav-frontend-chevron';

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

AktivitetTabell.Row = ({ isActive, renderWhenActive, children }) => {
    const rowCls = isActive
        ? 'aktivitetTabell__tr aktivitetTabell__tr--active'
        : 'aktivitetTabell__tr';
    const rowContent = (
        <div className={rowCls} role="row">
            {children}
        </div>
    );

    if (isActive) {
        return [rowContent, renderWhenActive()];
    }

    return rowContent;
};

AktivitetTabell.Column = ({ children, ...otherProps }) => {
    return (
        <div className="aktivitetTabell__td" role="cell" {...otherProps}>
            {children}
        </div>
    );
};

export default AktivitetTabell;
