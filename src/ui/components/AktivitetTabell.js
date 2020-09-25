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

AktivitetTabell.Row = ({ isActive, renderWhenActive, children, ...otherProps }) => {
    const rowCls = isActive
        ? 'aktivitetTabell__tr aktivitetTabell__tr--active'
        : 'aktivitetTabell__tr';
    const rowContent = (
        <div {...otherProps} role="row" className={rowCls}>
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
        <div {...otherProps} className="aktivitetTabell__td" role="cell">
            {children}
        </div>
    );
};

export default AktivitetTabell;
