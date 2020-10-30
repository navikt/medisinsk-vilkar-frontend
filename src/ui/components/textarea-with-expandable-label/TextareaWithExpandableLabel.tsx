import * as React from 'react';
import TextArea from '../../form/wrappers/TextArea';
import Box, { Margin } from '../box/Box';
import ExpandableLabel from '../expandableLabel/ExpandableLabel';

interface TextareaWithExpandableLabelProps {
    id: string;
    labelText: React.ReactNode;
    helptext: string;
    textareaName: string;
    validators?: { [key: string]: (v: any) => string | undefined };
}

const TextareaWithExpandableLabel = ({
    id,
    labelText,
    helptext,
    textareaName,
    validators,
}: TextareaWithExpandableLabelProps): JSX.Element => (
    <>
        <ExpandableLabel labelText={labelText} helptext={helptext} labelFor={id} />
        <Box marginTop={Margin.medium}>
            <TextArea id={id} name={textareaName} validators={validators} />
        </Box>
    </>
);

export default TextareaWithExpandableLabel;
