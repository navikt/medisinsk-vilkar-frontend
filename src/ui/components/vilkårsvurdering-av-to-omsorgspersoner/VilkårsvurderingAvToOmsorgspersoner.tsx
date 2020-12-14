import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import React from 'react';
import Vurdering from '../../../types/Vurdering';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { prettifyPeriod } from '../../../util/formats';
import { hentToOmsorgspersonerVurderingsoversikt } from '../../../util/httpMock';
import ContainerContext from '../../context/ContainerContext';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import ActionType from './actionTypes';
import vilkårsvurderingReducer from './reducer';
import VurderingsdetaljerForToOmsorgspersoner from '../vurderingsdetaljer-for-to-omsorgspersoner/VurderingsdetaljerForToOmsorgspersoner';
import Vurderingsnavigasjon from '../vurderingsnavigasjon/Vurderingsnavigasjon';

const VilkårsvurderingAvToOmsorgspersoner = (): JSX.Element => {
    const { vurdering, onVurderingValgt } = React.useContext(ContainerContext);

    const [state, dispatch] = React.useReducer(vilkårsvurderingReducer, {
        visVurderingDetails: !!vurdering,
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

        hentToOmsorgspersonerVurderingsoversikt().then((nyVurderingsoversikt: Vurderingsoversikt) => {
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
                        <Vurderingsnavigasjon
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
                            <VurderingsdetaljerForToOmsorgspersoner
                                vurderingId={valgtVurdering?.id}
                                onVurderingLagret={() => null}
                                perioderSomSkalVurderes={perioderTilVurderingDefaultValue}
                                perioderSomKanVurderes={vurderingsoversikt?.perioderSomKanVurderes}
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
