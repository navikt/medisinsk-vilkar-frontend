import { Box, Margin } from '@navikt/k9-react-components';
import AlertStripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import * as React from 'react';
import ContainerContext from '../../context/ContainerContext';

const AksjonspunktFerdigStripe = () => {
    const { onFinished } = React.useContext(ContainerContext);

    return (
        <Box marginBottom={Margin.medium}>
            <AlertStripe type="info">
                Sykdom er ferdig vurdert og du kan gå videre i behandlingen.
                <Knapp
                    type="hoved"
                    htmlType="button"
                    style={{ marginLeft: '2rem', marginBottom: '-0.25rem' }}
                    onClick={() => onFinished()}
                    mini
                >
                    Fortsett
                </Knapp>
            </AlertStripe>
        </Box>
    );
};

export default AksjonspunktFerdigStripe;
