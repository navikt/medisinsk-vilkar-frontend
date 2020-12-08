import { Knapp } from 'nav-frontend-knapper';
import React, { useMemo } from 'react';
import Vurdering from '../../../types/Vurdering';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { hentTilsynsbehovVurderingsoversikt } from '../../../util/httpMock';
import { slåSammenSammenhengendePerioder } from '../../../util/periodUtils';
import { lagreVurderingIVurderingsoversikt } from '../../../util/vurderingsoversikt';
import { makeTilsynsbehovFormStateAsVurderingObject } from '../../../util/vurderingUtils';
import ContainerContext from '../../context/ContainerContext';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import VurderingAvTilsynsbehovForm, {
    FieldName,
    VurderingAvTilsynsbehovFormState,
} from '../ny-vurdering-av-tilsynsbehov/NyVurderingAvTilsynsbehovForm';
import VurderingNavigation from '../vurdering-navigation/VurderingNavigation';
import VurderingsdetaljerForKontinuerligTilsynOgPleie from '../vurderingsdetaljer-for-kontinuerlig-tilsyn-og-pleie/VurderingsdetaljerForKontinuerligTilsynOgPleie';

const finnValgtVurdering = (vurderinger, vurderingId) => {
    return vurderinger.find(({ id }) => vurderingId === id);
};

interface VilkårsvurderingAvTilsynOgPleieProps {
    onVilkårVurdert: (vurderingsoversikt: Vurderingsoversikt) => void;
}

const VilkårsvurderingAvTilsynOgPleie = ({ onVilkårVurdert }: VilkårsvurderingAvTilsynOgPleieProps) => {
    const { vurdering, onVurderingValgt } = React.useContext(ContainerContext);

    const [isLoading, setIsLoading] = React.useState(true);
    const [vurderingsoversikt, setVurderingsoversikt] = React.useState<Vurderingsoversikt>(null);
    const [valgtVurdering, setValgtVurdering] = React.useState(null);
    const [nyVurderingOpen, setNyVurderingOpen] = React.useState(false);
    const [perioderTilVurderingDefaultValue, setPerioderTilVurderingDefaultValue] = React.useState([]);

    const harPerioderSomSkalVurderes =
        vurderingsoversikt &&
        vurderingsoversikt.perioderSomSkalVurderes &&
        vurderingsoversikt.perioderSomSkalVurderes.length > 0;

    const hentVurderingsoversikt = () => {
        setIsLoading(true);
        return hentTilsynsbehovVurderingsoversikt();
    };

    React.useEffect(() => {
        let isMounted = true;

        hentVurderingsoversikt().then((vurderingsoversikt: Vurderingsoversikt) => {
            if (isMounted) {
                setVurderingsoversikt(vurderingsoversikt);
                setValgtVurdering(finnValgtVurdering(vurderingsoversikt.vurderinger, vurdering) || null);
                setIsLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

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

    const lagreVurderingAvTilsynsbehov = (data: VurderingAvTilsynsbehovFormState) => {
        setIsLoading(true);
        lagreVurderingIVurderingsoversikt(makeTilsynsbehovFormStateAsVurderingObject(data), vurderingsoversikt).then(
            (nyVurderingsoversikt) => {
                setVurderingsoversikt(nyVurderingsoversikt);
                setIsLoading(false);
                setNyVurderingOpen(false);
            }
        );
    };

    const sammenslåtteSøknadsperioder = useMemo(() => {
        if (vurderingsoversikt) {
            return slåSammenSammenhengendePerioder(vurderingsoversikt.søknadsperioder);
        }
        return [];
    }, [vurderingsoversikt]);

    if (isLoading) {
        return <p>Henter vurderinger</p>;
    }
    return (
        <>
            <NavigationWithDetailView
                navigationSection={() => (
                    <VurderingNavigation
                        vurderinger={vurderingsoversikt?.vurderinger}
                        onVurderingValgt={velgVurdering}
                        onNyVurderingClick={visNyVurderingUtenPreutfylling}
                        perioderSomSkalVurderes={vurderingsoversikt?.perioderSomSkalVurderes}
                        onPerioderSomSkalVurderesClick={visPreutfyltVurdering}
                    />
                )}
                detailSection={() => {
                    if (nyVurderingOpen) {
                        return (
                            <VurderingAvTilsynsbehovForm
                                defaultValues={{
                                    [FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
                                    [FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: undefined,
                                    [FieldName.PERIODER]: perioderTilVurderingDefaultValue,
                                    [FieldName.DOKUMENTER]: [],
                                }}
                                onSubmit={lagreVurderingAvTilsynsbehov}
                                perioderSomSkalVurderes={vurderingsoversikt.perioderSomSkalVurderes}
                                sammenhengendeSøknadsperioder={sammenslåtteSøknadsperioder}
                            />
                        );
                    }
                    if (valgtVurdering !== null) {
                        return <VurderingsdetaljerForKontinuerligTilsynOgPleie vurdering={valgtVurdering} />;
                    }
                    return null;
                }}
            />
            {!harPerioderSomSkalVurderes && (
                <Knapp style={{ marginTop: '2rem' }} onClick={() => onVilkårVurdert(vurderingsoversikt)}>
                    Lagre og gå videre til vurdering av to omsorgspersoner
                </Knapp>
            )}
        </>
    );
};

export default VilkårsvurderingAvTilsynOgPleie;
