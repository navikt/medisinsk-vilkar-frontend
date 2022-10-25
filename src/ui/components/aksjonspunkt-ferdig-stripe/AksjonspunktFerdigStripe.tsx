import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import AlertStripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import * as React from 'react';
import FagsakYtelseType from '../../../constants/FagsakYtelseType';
import ContainerContext from '../../context/ContainerContext';

const AksjonspunktFerdigStripe = (): JSX.Element => {
    const { onFinished } = React.useContext(ContainerContext);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const { fagsakYtelseType } = React.useContext(ContainerContext);
    const erPleiepengerSluttfaseFagsak = fagsakYtelseType === FagsakYtelseType.PLEIEPENGER_SLUTTFASE;

    return (
        <Box marginBottom={Margin.medium}>
            <AlertStripe type="info">
                {erPleiepengerSluttfaseFagsak && <>Vilkåret er ferdig vurdert og du kan gå videre i behandlingen.</>}
                {!erPleiepengerSluttfaseFagsak && <>Sykdom er ferdig vurdert og du kan gå videre i behandlingen.</>}
                <Knapp
                    type="hoved"
                    htmlType="button"
                    style={{ marginLeft: '2rem', marginBottom: '-0.25rem' }}
                    disabled={isSubmitting}
                    spinner={isSubmitting}
                    onClick={() => {
                        setIsSubmitting(true);
                        setTimeout(() => setIsSubmitting(false), 10 * 1000);
                        onFinished();
                    }}
                    mini
                >
                    Fortsett
                </Knapp>
            </AlertStripe>
        </Box>
    );
};

export default AksjonspunktFerdigStripe;
