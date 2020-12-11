import React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Vurdering from '../../../types/Vurdering';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { hentTilsynsbehovVurderingsoversikt } from '../../../util/httpMock';
import ContainerContext from '../../context/ContainerContext';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import VurderingNavigation from '../vurdering-navigation/VurderingNavigation';
import { prettifyPeriod } from '../../../util/formats';
import VurderingDetails from '../VurderingDetails';

const finnValgtVurdering = (vurderinger, vurderingId) => {
    return vurderinger.find(({ id }) => vurderingId === id);
};

interface VilkårsvurderingAvTilsynOgPleieProps {
    onVilkårVurdert: () => void;
}

const VilkårsvurderingAvTilsynOgPleie = ({ onVilkårVurdert }: VilkårsvurderingAvTilsynOgPleieProps) => {
    const { vurdering, onVurderingValgt } = React.useContext(ContainerContext);

    const [visVurderingDetails, setVisVurderingDetails] = React.useState(vurdering != undefined);

    const [isLoading, setIsLoading] = React.useState(true);
    const [vurderingsoversikt, setVurderingsoversikt] = React.useState<Vurderingsoversikt>(null);
    const [valgtVurdering, setValgtVurdering] = React.useState(null);
    const [perioderTilVurderingDefaultValue, setPerioderTilVurderingDefaultValue] = React.useState([]);

    const harPerioderSomSkalVurderes =
        vurderingsoversikt &&
        vurderingsoversikt.perioderSomSkalVurderes &&
        vurderingsoversikt.perioderSomSkalVurderes.length > 0;

    React.useEffect(() => {
        let isMounted = true;

        hentTilsynsbehovVurderingsoversikt().then((vurderingsoversikt: Vurderingsoversikt) => {
            if (isMounted) {
                setVurderingsoversikt(vurderingsoversikt);
                setValgtVurdering(finnValgtVurdering(vurderingsoversikt.vurderinger, vurdering) || null);
                setIsLoading(false);
                setPerioderTilVurderingDefaultValue(vurderingsoversikt?.perioderSomSkalVurderes || []);
            }
        });

        return () => {
            isMounted = false;
        };
    });

    const visNyVurderingUtenPreutfylling = () => {
        onVurderingValgt(null);
        setValgtVurdering(null);
        setPerioderTilVurderingDefaultValue([]);
        setVisVurderingDetails(true);
    };

    const visPreutfyltVurdering = () => {
        onVurderingValgt(null);
        setValgtVurdering(null);
        setPerioderTilVurderingDefaultValue(vurderingsoversikt?.perioderSomSkalVurderes || []);
        setVisVurderingDetails(true);
    };

    const velgVurdering = (v: Vurdering) => {
        onVurderingValgt(v.id);
        setValgtVurdering(v);
        setVisVurderingDetails(true);
    };

    if (isLoading) {
        return <p>Henter vurderinger</p>;
    }
    return (
        <>
            {harPerioderSomSkalVurderes && (
                <div style={{ maxWidth: '1194px' }}>
                    <AlertStripeAdvarsel>
                        {`Vurder behov for tilsyn og pleie for perioden ${prettifyPeriod(
                            vurderingsoversikt?.perioderSomSkalVurderes[0]
                        )}.`}
                        Perioden som skal vurderes overlapper med tidligere vurderinger. Vurder om det er grunnlag for å
                        gjøre en ny vurdering.
                    </AlertStripeAdvarsel>
                    <div style={{ marginTop: '1rem' }}></div>
                </div>
            )}
            <NavigationWithDetailView
                navigationSection={() => (
                    <VurderingNavigation
                        vurderinger={vurderingsoversikt?.vurderinger}
                        perioderSomSkalVurderes={vurderingsoversikt?.perioderSomSkalVurderes}
                        onVurderingValgt={velgVurdering}
                        onNyVurderingClick={visNyVurderingUtenPreutfylling}
                        onPerioderSomSkalVurderesClick={visPreutfyltVurdering}
                        kanOppretteNyeVurderinger={true}
                    />
                )}
                detailSection={() => {
                    if (visVurderingDetails) {
                        return (
                            <VurderingDetails
                                vurderingId={valgtVurdering?.id}
                                onVurderingLagret={() => {}}
                                perioderTilVurdering={perioderTilVurderingDefaultValue}
                            />
                        );
                    }
                    return null;
                }}
            />
            {!harPerioderSomSkalVurderes && (
                <Knapp style={{ marginTop: '2rem' }} onClick={() => onVilkårVurdert()}>
                    Gå videre til vurdering av to omsorgspersoner
                </Knapp>
            )}
        </>
    );
};

export default VilkårsvurderingAvTilsynOgPleie;
