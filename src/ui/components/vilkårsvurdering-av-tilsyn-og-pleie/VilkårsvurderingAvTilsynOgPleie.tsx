import React, { useMemo } from 'react';
import Vurdering from '../../../types/Vurdering';
import { hentTilsynsbehovVurderingsoversikt } from '../../../util/httpMock';
import ContainerContext from '../../context/ContainerContext';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import VurderingAvTilsynsbehovForm, {
    FieldName,
    VurderingAvTilsynsbehovFormState,
} from '../ny-vurdering-av-tilsynsbehov/NyVurderingAvTilsynsbehovForm';
import VurderingNavigation from '../vurdering-navigation/VurderingNavigation';
import VurderingsdetaljerForKontinuerligTilsynOgPleie from '../vurderingsdetaljer-for-kontinuerlig-tilsyn-og-pleie/VurderingsdetaljerForKontinuerligTilsynOgPleie';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { makeTilsynsbehovFormStateAsVurderingObject } from '../../../util/vurderingUtils';
import { slåSammenSammenhengendePerioder } from '../../../util/periodUtils';

const finnValgtVurdering = (vurderinger, vurderingId) => {
    return vurderinger.find(({ id }) => vurderingId === id);
};

const VilkårsvurderingAvTilsynOgPleie = () => {
    const { vurdering, onVurderingValgt } = React.useContext(ContainerContext);

    const [isLoading, setIsLoading] = React.useState(true);
    const [vurderingsoversikt, setVurderingsoversikt] = React.useState<Vurderingsoversikt>(null);
    const [valgtVurdering, setValgtVurdering] = React.useState(null);
    const [nyVurderingOpen, setNyVurderingOpen] = React.useState(false);
    const [perioderTilVurderingDefaultValue, setPerioderTilVurderingDefaultValue] = React.useState([]);

    const hentVurderingsoversikt = () => {
        setIsLoading(true);
        return hentTilsynsbehovVurderingsoversikt();
    };

    React.useEffect(() => {
        hentVurderingsoversikt().then((vurderingsoversikt: Vurderingsoversikt) => {
            setVurderingsoversikt(vurderingsoversikt);
            setValgtVurdering(finnValgtVurdering(vurderingsoversikt.vurderinger, vurdering) || null);
            setIsLoading(false);
        });
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
        hentVurderingsoversikt().then((vurderingsoversikt) => {
            vurderingsoversikt.vurderinger.push(makeTilsynsbehovFormStateAsVurderingObject(data));
            setVurderingsoversikt(vurderingsoversikt);
            setIsLoading(false);
        });
    };

    const sammenslåttePerioderSomSkalVurderes = useMemo(() => {
        if (vurderingsoversikt) {
            return slåSammenSammenhengendePerioder(vurderingsoversikt.perioderSomSkalVurderes);
        }
        return [];
    }, [vurderingsoversikt]);

    if (isLoading) {
        return <p>Henter vurderinger</p>;
    }
    return (
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
                                [FieldName.PERIODER]: sammenslåttePerioderSomSkalVurderes,
                            }}
                            onSubmit={lagreVurderingAvTilsynsbehov}
                            perioderSomSkalVurderes={sammenslåttePerioderSomSkalVurderes}
                        />
                    );
                }
                if (valgtVurdering !== null) {
                    return <VurderingsdetaljerForKontinuerligTilsynOgPleie vurdering={valgtVurdering} />;
                }
                return null;
            }}
        />
    );
};

export default VilkårsvurderingAvTilsynOgPleie;
