import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import React from 'react';
import Vurdering from '../../../types/Vurdering';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { prettifyPeriod } from '../../../util/formats';
import { hentTilsynsbehovVurderingsoversikt } from '../../../util/httpMock';
import ContainerContext from '../../context/ContainerContext';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import VurderingNavigation from '../vurdering-navigation/VurderingNavigation';
import ActionType from './actionTypes';
import vilkårsvurderingReducer from './reducer';

interface VilkårsvurderingAvTilsynOgPleieProps {
    onVilkårVurdert: () => void;
}

const VilkårsvurderingAvTilsynOgPleie = ({ onVilkårVurdert }: VilkårsvurderingAvTilsynOgPleieProps) => {
    const { vurdering, onVurderingValgt } = React.useContext(ContainerContext);

    const [state, dispatch] = React.useReducer(vilkårsvurderingReducer, {
        visVurderingDetails: vurdering != undefined,
        isLoading: true,
        vurderingsoversikt: null,
        valgtVurdering: null,
        perioderTilVurderingDefaultValue: [],
        vurdering,
    });

    const {
        vurderingsoversikt,
        isLoading,
        visVurderingDetails,
        valgtVurdering,
        perioderTilVurderingDefaultValue,
    } = state;

    const harPerioderSomSkalVurderes =
        vurderingsoversikt &&
        vurderingsoversikt.perioderSomSkalVurderes &&
        vurderingsoversikt.perioderSomSkalVurderes.length > 0;

    React.useEffect(() => {
        let isMounted = true;
        hentTilsynsbehovVurderingsoversikt().then((nyVurderingsoversikt: Vurderingsoversikt) => {
            if (isMounted) {
                dispatch({ type: ActionType.VIS_EKSISTERENDE_VURDERING, vurderingsoversikt: nyVurderingsoversikt });
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    const visNyVurderingUtenPreutfylling = () => {
        onVurderingValgt(null);
        dispatch({ type: ActionType.VIS_NY_VURDERING_FORM });
    };

    const visPreutfyltVurdering = () => {
        onVurderingValgt(null);
        dispatch({ type: ActionType.VIS_NY_VURDERING_FORM_PREUTFYLT });
    };

    const velgVurdering = (nyValgtVurdering: Vurdering) => {
        onVurderingValgt(nyValgtVurdering.id);
        dispatch({ type: ActionType.VELG_VURDERING, vurdering: nyValgtVurdering });
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
                            <VurderingDetailsTilsyn
                                vurderingId={valgtVurdering?.id}
                                onVurderingLagret={() => {}}
                                perioderTilVurdering={perioderTilVurderingDefaultValue}
                                perioderSomKanVurderes={vurderingsoversikt?.perioderSomKanVurderes}
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
