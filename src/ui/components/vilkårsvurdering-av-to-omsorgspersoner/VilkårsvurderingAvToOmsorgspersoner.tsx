import React, { useMemo } from 'react';
import Spinner from 'nav-frontend-spinner';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { prettifyPeriod } from '../../../util/formats';
import ContainerContext from '../../context/ContainerContext';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import ActionType from './actionTypes';
import vilkårsvurderingReducer from './reducer';
import VurderingsdetaljerForToOmsorgspersoner from '../vurderingsdetaljer-for-to-omsorgspersoner/VurderingsdetaljerForToOmsorgspersoner';
import Vurderingsnavigasjon from '../vurderingsnavigasjon/Vurderingsnavigasjon';
import { Period } from '../../../types/Period';
import Vurderingselement from '../../../types/Vurderingselement';
import { fetchData } from '../../../util/httpUtils';
import processVurderingsoversikt from '../../../util/vurderingsoversiktUtils';
import PageError from '../page-error/PageError';

const VilkårsvurderingAvToOmsorgspersoner = (): JSX.Element => {
    const { vurdering, onVurderingValgt, endpoints } = React.useContext(ContainerContext);

    const fetchAborter = useMemo(() => new AbortController(), []);

    const [state, dispatch] = React.useReducer(vilkårsvurderingReducer, {
        visVurderingDetails: false,
        isLoading: true,
        vurderingsoversikt: null,
        valgtVurderingselement: null,
        resterendeVurderingsperioderDefaultValue: [],
        vurdering,
        vurderingsoversiktFeilet: false,
    });

    const {
        vurderingsoversikt,
        isLoading,
        visVurderingDetails,
        valgtVurderingselement,
        resterendeVurderingsperioderDefaultValue,
        vurderingsoversiktFeilet,
    } = state;

    const harPerioderSomSkalVurderes = vurderingsoversikt?.resterendeVurderingsperioder?.length > 0;

    const getVurderingsoversikt = () => {
        const { signal } = fetchAborter;
        return fetchData<Vurderingsoversikt>(endpoints.vurderingsoversiktBehovForToOmsorgspersoner, { signal });
    };

    const visVurderingsoversikt = (nyVurderingsoversikt: Vurderingsoversikt) => {
        dispatch({ type: ActionType.VIS_VURDERINGSOVERSIKT, vurderingsoversikt: nyVurderingsoversikt });
    };

    const handleError = () => {
        dispatch({ type: ActionType.VURDERINGSOVERSIKT_FEILET });
    };

    React.useEffect(() => {
        let isMounted = true;
        getVurderingsoversikt()
            .then(processVurderingsoversikt)
            .then((nyVurderingsoversikt) => {
                if (isMounted) {
                    visVurderingsoversikt(nyVurderingsoversikt);
                }
            })
            .catch(handleError);
        return () => {
            isMounted = false;
            fetchAborter.abort();
        };
    }, []);

    const visNyVurderingForm = (resterendeVurderingsperioder?: Period[]) => {
        onVurderingValgt(null);
        dispatch({ type: ActionType.VIS_NY_VURDERING_FORM, resterendeVurderingsperioder });
    };

    const velgVurderingselement = (nyvalgtVurderingselement: Vurderingselement) => {
        onVurderingValgt(nyvalgtVurderingselement.id);
        dispatch({ type: ActionType.VELG_VURDERINGSELEMENT, vurderingselement: nyvalgtVurderingselement });
    };

    const oppdaterVurderingsoversikt = () => {
        dispatch({ type: ActionType.PENDING });
        getVurderingsoversikt().then(processVurderingsoversikt).then(visVurderingsoversikt);
    };

    if (isLoading) {
        return <Spinner />;
    }
    if (vurderingsoversiktFeilet) {
        return <PageError message="Noe gikk galt, vennligst prøv igjen senere" />;
    }
    return (
        <>
            {harPerioderSomSkalVurderes && (
                <div style={{ maxWidth: '1194px' }}>
                    <AlertStripeAdvarsel>
                        {`Vurder behov for to omsorgspersoner for perioden ${prettifyPeriod(
                            vurderingsoversikt?.resterendeVurderingsperioder[0]
                        )}.`}
                    </AlertStripeAdvarsel>
                    <div style={{ marginTop: '1rem' }} />
                </div>
            )}
            <NavigationWithDetailView
                navigationSection={() => {
                    if (vurderingsoversikt?.resterendeVurderingsperioder.length === 0) {
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
                            vurderingselementer={vurderingsoversikt?.vurderingselementer}
                            resterendeVurderingsperioder={vurderingsoversikt?.resterendeVurderingsperioder}
                            søknadsperioderTilBehandling={vurderingsoversikt?.søknadsperioderTilBehandling}
                            onVurderingValgt={velgVurderingselement}
                            onNyVurderingClick={visNyVurderingForm}
                        />
                    );
                }}
                detailSection={() => {
                    if (visVurderingDetails) {
                        return (
                            <VurderingsdetaljerForToOmsorgspersoner
                                vurderingId={valgtVurderingselement?.id}
                                onVurderingLagret={oppdaterVurderingsoversikt}
                                resterendeVurderingsperioder={resterendeVurderingsperioderDefaultValue}
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
