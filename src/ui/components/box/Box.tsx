import classNames from 'classnames/bind';
import * as React from 'react';
import styles from './box.less';

const cx = classNames.bind(styles);

export enum Margin {
    small = 'small',
    medium = 'medium',
    large = 'large',
    xLarge = 'xLarge',
}

interface BoxProps {
    children: React.ReactNode;
    marginBottom?: Margin;
    marginTop?: Margin;
    maxWidth?: string;
}

const Box = ({ children, marginBottom, marginTop, maxWidth }: BoxProps): JSX.Element => {
    const marginTopClass = `${marginTop}MarginTop`;
    const marginBottomClass = `${marginBottom}MarginBottom`;
    const boxClassnames = cx({
        [marginTopClass]: marginTop,
        [marginBottomClass]: marginBottom,
    });
    return (
        <div className={boxClassnames} style={{ maxWidth }}>
            {children}
        </div>
    );
};

export default Box;
