import React from 'react';
import Vurdering from '../../../types/Vurdering';
import { hentToOmsorgspersonerVurderingsoversikt } from '../../../util/httpMock';
import ContainerContext from '../../context/ContainerContext';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import {
    FieldName,
    VurderingAvToOmsorgspersonerFormState,
} from '../ny-vurdering-av-to-omsorgspersoner/NyVurderingAvToOmsorgspersoner';
import VurderingNavigation from '../vurdering-navigation/VurderingNavigation';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { makeToOmsorgspersonerFormStateAsVurderingObject } from '../../../util/vurderingUtils';
import VurderingsdetaljerForToOmsorgspersoner from '../vurderingsdetaljer-for-to-omsorgspersoner/VurderingsdetaljerForToOmsorgspersoner';
import VurderingAvToOmsorgspersonerForm from '../ny-vurdering-av-to-omsorgspersoner/NyVurderingAvToOmsorgspersoner';

const finnValgtVurdering = (vurderinger, vurderingId) => {
    return vurderinger.find(({ id }) => vurderingId === id);
};

const VilkårsvurderingAvToOmsorgspersoner = () => {
    const { vurdering, onVurderingValgt } = React.useContext(ContainerContext);

    const [isLoading, setIsLoading] = React.useState(true);
    const [vurderingsoversikt, setVurderingsoversikt] = React.useState<Vurderingsoversikt>(null);
    const [valgtVurdering, setValgtVurdering] = React.useState(null);
    const [nyVurderingOpen, setNyVurderingOpen] = React.useState(false);

    const hentVurderingsoversikt = () => {
        setIsLoading(true);
        return hentToOmsorgspersonerVurderingsoversikt();
    };

    React.useEffect(() => {
        hentVurderingsoversikt().then((vurderingsoversikt: Vurderingsoversikt) => {
            setVurderingsoversikt(vurderingsoversikt);
            setValgtVurdering(finnValgtVurdering(vurderingsoversikt.vurderinger, vurdering) || null);
            setIsLoading(false);
        });
    }, []);

    const velgVurdering = (v: Vurdering) => {
        if (v === null) {
            onVurderingValgt(null);
            setValgtVurdering(null);
            setNyVurderingOpen(true);
        } else {
            onVurderingValgt(v.id);
            setValgtVurdering(v);
            setNyVurderingOpen(false);
        }
    };

    const lagreVurderingAvToOmsorgspersoner = (data: VurderingAvToOmsorgspersonerFormState) => {
        hentVurderingsoversikt().then((vurderingsoversikt) => {
            vurderingsoversikt.vurderinger.push(makeToOmsorgspersonerFormStateAsVurderingObject(data));
            setVurderingsoversikt(vurderingsoversikt);
            setIsLoading(false);
        });
    };

    if (isLoading) {
        return <p>Henter vurderinger</p>;
    }
    return (
        <NavigationWithDetailView
            navigationSection={() => (
                <VurderingNavigation
                    vurderinger={vurderingsoversikt?.vurderinger}
                    perioderSomSkalVurderes={vurderingsoversikt?.perioderSomSkalVurderes}
                    onVurderingValgt={velgVurdering}
                    onNyVurderingClick={() => setNyVurderingOpen(true)}
                />
            )}
            detailSection={() => {
                if (nyVurderingOpen) {
                    return (
                        <VurderingAvToOmsorgspersonerForm
                            defaultValues={{
                                [FieldName.VURDERING_AV_TO_OMSORGSPERSONER]: '',
                                [FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: undefined,
                                [FieldName.PERIODER]: vurderingsoversikt.perioderSomSkalVurderes,
                            }}
                            onSubmit={lagreVurderingAvToOmsorgspersoner}
                            perioderSomSkalVurderes={vurderingsoversikt.perioderSomSkalVurderes}
                        />
                    );
                }
                if (valgtVurdering !== null) {
                    return <VurderingsdetaljerForToOmsorgspersoner vurdering={valgtVurdering} />;
                }
                return null;
            }}
        />
    );
};

export default VilkårsvurderingAvToOmsorgspersoner;
