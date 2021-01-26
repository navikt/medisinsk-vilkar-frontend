import React, { useMemo } from 'react';
import axios from 'axios';
import Alertstripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import Spinner from 'nav-frontend-spinner';
import { Period } from '../../../types/Period';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { prettifyPeriod } from '../../../util/formats';
import ContainerContext from '../../context/ContainerContext';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import Vurderingsnavigasjon from '../vurderingsnavigasjon/Vurderingsnavigasjon';
import ActionType from './actionTypes';
import vilkårsvurderingReducer from './reducer';
import processVurderingsoversikt from '../../../util/vurderingsoversiktUtils';
import { fetchData } from '../../../util/httpUtils';
import PageError from '../page-error/PageError';
import LinkRel from '../../../constants/LinkRel';
import { findHrefByRel, findLinkByRel } from '../../../util/linkUtils';
import NyVurderingAvTilsynsbehovController from '../ny-vurdering-av-tilsynsbehov-controller/NyVurderingAvTilsynsbehovController';
import VurderingsdetaljerController from '../vurderingsdetaljer-controller/VurderingsdetaljerController';
import VurderingsoppsummeringForKontinuerligTilsynOgPleie from '../vurderingsoppsummering-for-kontinuerlig-tilsyn-og-pleie/VurderingsoppsummeringForKontinuerligTilsynOgPleie';

interface VilkårsvurderingAvTilsynOgPleieProps {
    onVilkårVurdert: () => void;
}

const VilkårsvurderingAvTilsynOgPleie = ({ onVilkårVurdert }: VilkårsvurderingAvTilsynOgPleieProps): JSX.Element => {
    const { vurdering, onVurderingValgt, endpoints } = React.useContext(ContainerContext);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

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

    const harPerioderSomSkalVurderes =
        vurderingsoversikt &&
        vurderingsoversikt.resterendeVurderingsperioder &&
        vurderingsoversikt.resterendeVurderingsperioder.length > 0;

    const harGyldigSignatur = vurderingsoversikt && vurderingsoversikt.harGyldigSignatur === true;

    const getVurderingsoversikt = () => {
        return fetchData<Vurderingsoversikt>(endpoints.vurderingsoversiktKontinuerligTilsynOgPleie, {
            cancelToken: httpCanceler.token,
        });
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
            httpCanceler.cancel();
        };
    }, []);

    const visNyVurderingForm = (resterendeVurderingsperioder?: Period[]) => {
        onVurderingValgt(null);
        dispatch({ type: ActionType.VIS_NY_VURDERING_FORM, resterendeVurderingsperioder });
    };

    const velgVurderingselement = (nyValgtVurderingselement: Vurderingselement) => {
        onVurderingValgt(nyValgtVurderingselement.id);
        dispatch({ type: ActionType.VELG_VURDERINGSELEMENT, valgtVurderingselement: nyValgtVurderingselement });
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
    if (harGyldigSignatur === false) {
        return (
            <Alertstripe type="info">
                Du kan ikke vurdere tilsyn og pleie før søker har sendt inn legeerklæring fra
                sykehus/spesialisthelsetjenesten.
            </Alertstripe>
        );
    }
    return (
        <>
            {harPerioderSomSkalVurderes && (
                <div style={{ maxWidth: '1204px' }}>
                    <Alertstripe type="advarsel">
                        {`Vurder behov for tilsyn og pleie for perioden ${prettifyPeriod(
                            vurderingsoversikt?.resterendeVurderingsperioder[0]
                        )}.`}
                        Perioden som skal vurderes overlapper med tidligere vurderinger. Vurder om det er grunnlag for å
                        gjøre en ny vurdering.
                    </Alertstripe>
                    <div style={{ marginTop: '1rem' }} />
                </div>
            )}
            <NavigationWithDetailView
                navigationSection={() => (
                    <Vurderingsnavigasjon
                        vurderingselementer={vurderingsoversikt?.vurderingselementer}
                        resterendeVurderingsperioder={vurderingsoversikt?.resterendeVurderingsperioder}
                        onVurderingValgt={velgVurderingselement}
                        onNyVurderingClick={visNyVurderingForm}
                    />
                )}
                detailSection={() => {
                    if (visVurderingDetails) {
                        if (valgtVurderingselement?.id) {
                            const url = findHrefByRel(LinkRel.HENT_VURDERING, valgtVurderingselement.links);
                            return (
                                <VurderingsdetaljerController
                                    hentVurderingUrl={url}
                                    contentRenderer={(valgtVurdering) => (
                                        <VurderingsoppsummeringForKontinuerligTilsynOgPleie
                                            vurdering={valgtVurdering}
                                        />
                                    )}
                                />
                            );
                        }

                        const opprettLink = findLinkByRel(LinkRel.OPPRETT_VURDERING, vurderingsoversikt.links);
                        const dataTilVurderingUrl = findHrefByRel(LinkRel.DATA_TIL_VURDERING, vurderingsoversikt.links);
                        return (
                            <NyVurderingAvTilsynsbehovController
                                opprettVurderingLink={opprettLink}
                                dataTilVurderingUrl={dataTilVurderingUrl}
                                onVurderingLagret={oppdaterVurderingsoversikt}
                                perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
                                resterendeVurderingsperioder={resterendeVurderingsperioderDefaultValue}
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
