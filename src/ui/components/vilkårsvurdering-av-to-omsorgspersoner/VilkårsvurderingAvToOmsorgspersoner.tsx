import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import React from 'react';
import Vurdering from '../../../types/Vurdering';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { prettifyPeriod } from '../../../util/formats';
import { hentToOmsorgspersonerVurderingsoversikt } from '../../../util/httpMock';
import ContainerContext from '../../context/ContainerContext';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import VurderingNavigation from '../vurdering-navigation/VurderingNavigation';
import VurderingDetailsToOmsorgspersoner from '../vurderings-details-to-omsorgspersoner/VurderingDetailsToOmsorgspersoner';

const finnValgtVurdering = (vurderinger, vurderingId) => {
    return vurderinger.find(({ id }) => vurderingId === id);
};

const VilkårsvurderingAvToOmsorgspersoner = (): JSX.Element => {
    const { vurdering, onVurderingValgt } = React.useContext(ContainerContext);

    const [isLoading, setIsLoading] = React.useState(true);
    const [vurderingsoversikt, setVurderingsoversikt] = React.useState<Vurderingsoversikt>();
    const [valgtVurdering, setValgtVurdering] = React.useState<Vurdering>(null);
    const [visVurderingDetails, setVisVurderingDetails] = React.useState(false);
    const [perioderTilVurderingDefaultValue, setPerioderTilVurderingDefaultValue] = React.useState([]);

    const harPerioderSomSkalVurderes =
        vurderingsoversikt &&
        vurderingsoversikt.perioderSomSkalVurderes &&
        vurderingsoversikt.perioderSomSkalVurderes.length > 0;

    React.useEffect(() => {
        let isMounted = true;

        hentToOmsorgspersonerVurderingsoversikt().then((nyVurderingsoversikt: Vurderingsoversikt) => {
            if (isMounted) {
                setVurderingsoversikt(nyVurderingsoversikt);
                setValgtVurdering(finnValgtVurdering(nyVurderingsoversikt.vurderinger, vurdering) || null);
                setIsLoading(false);
                setPerioderTilVurderingDefaultValue(nyVurderingsoversikt?.perioderSomSkalVurderes || []);
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
        setVisVurderingDetails(false);
    };

    if (isLoading) {
        return <p>Henter vurderinger</p>;
    }
    return (
        <>
            {harPerioderSomSkalVurderes && (
                <div style={{ maxWidth: '1194px' }}>
                    <AlertStripeAdvarsel>
                        {`Vurder behov for to omsorgspersoner for perioden ${prettifyPeriod(
                            vurderingsoversikt?.perioderSomSkalVurderes[0]
                        )}.`}
                    </AlertStripeAdvarsel>
                    <div style={{ marginTop: '1rem' }} />
                </div>
            )}
            <NavigationWithDetailView
                navigationSection={() => {
                    if (vurderingsoversikt?.perioderSomSkalVurderes.length === 0) {
                        return (
                            <div style={{ marginTop: '1rem' }}>
                                <AlertStripeInfo>
                                    To omsorgspersoner skal ikke vurderes før tilsyn og pleie er blitt innvilget og det
                                    er to parter i saken.
                                </AlertStripeInfo>
                            </div>
                        );
                    }
                    return (
                        <VurderingNavigation
                            vurderinger={vurderingsoversikt?.vurderinger}
                            onVurderingValgt={velgVurdering}
                            onNyVurderingClick={visNyVurderingUtenPreutfylling}
                            perioderSomSkalVurderes={vurderingsoversikt?.perioderSomSkalVurderes}
                            onPerioderSomSkalVurderesClick={visPreutfyltVurdering}
                            kanOppretteNyeVurderinger={vurderingsoversikt?.perioderSomSkalVurderes.length > 0}
                        />
                    );
                }}
                detailSection={() => {
                    if (visVurderingDetails) {
                        return (
                            <VurderingDetailsToOmsorgspersoner
                                vurderingId={valgtVurdering?.id}
                                onVurderingLagret={() => null}
                                perioderTilVurdering={perioderTilVurderingDefaultValue}
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
