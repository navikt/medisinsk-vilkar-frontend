import React, { useMemo } from 'react';
import Vurdering from '../../../types/Vurdering';
import ContainerContext from '../../context/ContainerContext';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import VurderingAvToOmsorgspersonerForm, {
    FieldName,
} from '../ny-vurdering-av-to-omsorgspersoner/NyVurderingAvToOmsorgspersoner';
import Vurderingsnavigasjon from '../vurderingsnavigasjon/Vurderingsnavigasjon';
import VurderingsoppsummeringForToOmsorgspersoner from '../vurderingsoppsummering-for-to-omsorgspersoner/VurderingsoppsummeringForToOmsorgspersoner';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { slåSammenSammenhengendePerioder } from '../../../util/periodUtils';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { prettifyPeriod } from '../../../util/formats';

const VilkårsvurderingAvToOmsorgspersoner = () => {
    const { onVurderingValgt } = React.useContext(ContainerContext);

    const [isLoading, setIsLoading] = React.useState(false);
    const [vurderingsoversikt, setVurderingsoversikt] = React.useState<Vurderingsoversikt>();
    const [valgtVurdering, setValgtVurdering] = React.useState(null);
    const [nyVurderingOpen, setNyVurderingOpen] = React.useState(false);
    const [perioderTilVurderingDefaultValue, setPerioderTilVurderingDefaultValue] = React.useState([]);

    const visNyVurderingUtenPreutfylling = () => {
        onVurderingValgt(null);
        setValgtVurdering(null);
        setPerioderTilVurderingDefaultValue([]);
        setNyVurderingOpen(true);
    };

    const visPreutfyltVurdering = () => {
        onVurderingValgt(null);
        setValgtVurdering(null);
        setPerioderTilVurderingDefaultValue(vurderingsoversikt?.perioderSomSkalVurderes || []);
        setNyVurderingOpen(true);
    };

    const velgVurdering = (v: Vurdering) => {
        onVurderingValgt(v.id);
        setValgtVurdering(v);
        setNyVurderingOpen(false);
    };

    const lagreVurderingAvToOmsorgspersoner = () => {
        setIsLoading(true);
    };

    const sammenslåttePerioderMedTilsynsbehov = useMemo(() => {
        if (vurderingsoversikt) {
            return slåSammenSammenhengendePerioder(vurderingsoversikt.perioderSomSkalVurderes);
        }
        return [];
    }, [vurderingsoversikt]);

    if (isLoading) {
        return <p>Henter vurderinger</p>;
    }
    return (
        <>
            {vurderingsoversikt.perioderSomSkalVurderes && vurderingsoversikt.perioderSomSkalVurderes.length > 0 && (
                <div style={{ maxWidth: '1194px' }}>
                    <AlertStripeAdvarsel>
                        {`Vurder behov for to omsorgspersoner for perioden ${prettifyPeriod(
                            vurderingsoversikt?.perioderSomSkalVurderes[0]
                        )}.`}
                    </AlertStripeAdvarsel>
                    <div style={{ marginTop: '1rem' }}></div>
                </div>
            )}
            <NavigationWithDetailView
                navigationSection={() => {
                    return (
                        <Vurderingsnavigasjon
                            vurderinger={vurderingsoversikt?.vurderinger}
                            onVurderingValgt={velgVurdering}
                            onNyVurderingClick={visNyVurderingUtenPreutfylling}
                            perioderSomSkalVurderes={vurderingsoversikt?.perioderSomSkalVurderes}
                        />
                    );
                }}
                detailSection={() => {
                    if (nyVurderingOpen) {
                        return (
                            <VurderingAvToOmsorgspersonerForm
                                defaultValues={{
                                    [FieldName.VURDERING_AV_TO_OMSORGSPERSONER]: '',
                                    [FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: undefined,
                                    [FieldName.PERIODER]: perioderTilVurderingDefaultValue,
                                    [FieldName.DOKUMENTER]: [],
                                }}
                                onSubmit={lagreVurderingAvToOmsorgspersoner}
                                perioderSomSkalVurderes={vurderingsoversikt.perioderSomSkalVurderes}
                                sammenhengendePerioderMedTilsynsbehov={sammenslåttePerioderMedTilsynsbehov}
                                dokumenter={vurderingsoversikt.dokumenter}
                            />
                        );
                    }
                    if (valgtVurdering !== null) {
                        return (
                            <VurderingsoppsummeringForToOmsorgspersoner
                                vurdering={valgtVurdering}
                                dokumenter={vurderingsoversikt.dokumenter}
                            />
                        );
                    }
                    return null;
                }}
            />
        </>
    );
};

export default VilkårsvurderingAvToOmsorgspersoner;
