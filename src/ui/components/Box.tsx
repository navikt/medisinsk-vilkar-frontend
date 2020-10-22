import classNames from 'classnames/bind';
import * as React from 'react';
import styles from './box.less';

const cx = classNames.bind(styles);

// eslint-disable-next-line no-shadow
export enum Margins {
    medium = 'medium',
    large = 'large',
}

interface BoxProps {
    children: React.ReactChild;
    marginBottom?: Margins;
    marginTop?: Margins;
}

const Box = ({ children, marginBottom, marginTop }: BoxProps): JSX.Element => {
    const marginTopClass = `${marginTop}MarginTop`;
    const marginBottomClass = `${marginBottom}MarginBottom`;
    const boxClassnames = cx({
        [marginTopClass]: marginTop,
        [marginBottomClass]: marginBottom,
    });
    return <div className={boxClassnames}>{children}</div>;
};

export default Box;
