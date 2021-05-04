import axios from 'axios';
import React, { useMemo } from 'react';
import LinkRel from '../../../constants/LinkRel';
import { Period } from '../../../types/Period';
import Step, { StepId, tilsynOgPleieSteg, toOmsorgspersonerSteg } from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import Vurderingstype from '../../../types/Vurderingstype';
import { get } from '../../../util/httpUtils';
import { findLinkByRel } from '../../../util/linkUtils';
import { finnNesteSteg } from '../../../util/statusUtils';
import ContainerContext from '../../context/ContainerContext';
import Box, { Margin } from '../box/Box';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import VurderingAvTilsynsbehovForm, { FieldName } from '../vurdering-av-tilsynsbehov-form/VurderingAvTilsynsbehovForm';
import NyVurderingController from '../ny-vurdering-controller/NyVurderingController';
import PageContainer from '../page-container/PageContainer';
import VurderingsdetaljerController from '../vurderingsdetaljer-controller/VurderingsdetaljerController';
import Vurderingsnavigasjon from '../vurderingsnavigasjon/Vurderingsnavigasjon';
import VurderingsoversiktMessages from '../vurderingsoversikt-messages/VurderingsoversiktMessages';
import ActionType from './actionTypes';
import vilkårsvurderingReducer from './reducer';
import VurderingsoppsummeringForKontinuerligTilsynOgPleie from '../vurderingsoppsummering-for-kontinuerlig-tilsyn-og-pleie/VurderingsoppsummeringForKontinuerligTilsynOgPleie';
import EndreVurderingController from '../endre-vurdering-controller/EndreVurderingController';
import { buildInitialFormStateForKontinuerligTilsynForEdit } from './initialFormStateUtil';
import ManuellVurdering from '../../../types/ManuellVurdering';

interface VilkårsvurderingAvTilsynOgPleieProps {
    navigerTilNesteSteg: (steg: Step, ikkeMarkerSteg?: boolean) => void;
    hentSykdomsstegStatus: () => Promise<SykdomsstegStatusResponse>;
    sykdomsstegStatus: SykdomsstegStatusResponse;
}

const VilkårsvurderingAvTilsynOgPleie = ({
    navigerTilNesteSteg,
    hentSykdomsstegStatus,
    sykdomsstegStatus,
}: VilkårsvurderingAvTilsynOgPleieProps): JSX.Element => {
    const { endpoints, httpErrorHandler } = React.useContext(ContainerContext);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    const [state, dispatch] = React.useReducer(vilkårsvurderingReducer, {
        visVurderingDetails: false,
        isLoading: true,
        vurderingsoversikt: null,
        valgtVurderingselement: null,
        resterendeVurderingsperioderDefaultValue: [],
        visRadForNyVurdering: false,
        vurderingsoversiktFeilet: false,
        erRedigeringsmodus: false,
    });

    const {
        vurderingsoversikt,
        isLoading,
        visVurderingDetails,
        valgtVurderingselement,
        resterendeVurderingsperioderDefaultValue,
        visRadForNyVurdering,
        vurderingsoversiktFeilet,
        erRedigeringsmodus,
    } = state;

    const { manglerGodkjentLegeerklæring } = sykdomsstegStatus;
    const harGyldigSignatur = !manglerGodkjentLegeerklæring;

    const getVurderingsoversikt = () =>
        get<Vurderingsoversikt>(endpoints.vurderingsoversiktKontinuerligTilsynOgPleie, httpErrorHandler, {
            cancelToken: httpCanceler.token,
        });

    const visVurderingsoversikt = (nyVurderingsoversikt: Vurderingsoversikt) => {
        dispatch({ type: ActionType.VIS_VURDERINGSOVERSIKT, vurderingsoversikt: nyVurderingsoversikt });
    };

    const handleError = () => {
        dispatch({ type: ActionType.VURDERINGSOVERSIKT_FEILET });
    };

    const visNyVurderingForm = (resterendeVurderingsperioder?: Period[]) => {
        dispatch({
            type: ActionType.VIS_NY_VURDERING_FORM,
            resterendeVurderingsperioder,
        });
    };

    const onAvbryt = () => {
        dispatch({
            type: ActionType.AVBRYT_FORM,
        });
    };

    const åpneFørstePeriodeSomMåBehandles = (nyVurderingsoversikt: Vurderingsoversikt) => {
        const harEnPeriodeSomMåBehandles = nyVurderingsoversikt?.resterendeVurderingsperioder?.length > 0;
        if (harEnPeriodeSomMåBehandles) {
            visNyVurderingForm(nyVurderingsoversikt.resterendeVurderingsperioder);
        }
    };

    React.useEffect(() => {
        let isMounted = true;
        getVurderingsoversikt()
            .then((vurderingsoversiktData) => {
                if (isMounted) {
                    const nyVurderingsoversikt = new Vurderingsoversikt(vurderingsoversiktData);
                    visVurderingsoversikt(nyVurderingsoversikt);
                    åpneFørstePeriodeSomMåBehandles(nyVurderingsoversikt);
                }
            })
            .catch(handleError);
        return () => {
            isMounted = false;
            httpCanceler.cancel();
        };
    }, []);

    const velgVurderingselement = (nyValgtVurderingselement: Vurderingselement) => {
        dispatch({ type: ActionType.VELG_VURDERINGSELEMENT, valgtVurderingselement: nyValgtVurderingselement });
    };

    const oppdaterVurderingsoversikt = () => {
        dispatch({ type: ActionType.PENDING });
        getVurderingsoversikt().then((vurderingsoversiktData) => {
            const nyVurderingsoversikt = new Vurderingsoversikt(vurderingsoversiktData);
            visVurderingsoversikt(nyVurderingsoversikt);
        });
    };

    const redigerVurdering = () => {
        dispatch({ type: ActionType.SET_REDIGERINGSMODUS });
    };

    const onVurderingLagret = () => {
        dispatch({ type: ActionType.PENDING });
        hentSykdomsstegStatus().then((status) => {
            if (status.kanLøseAksjonspunkt) {
                navigerTilNesteSteg(toOmsorgspersonerSteg, true);
                return;
            }

            const nesteSteg = finnNesteSteg(status);
            if (nesteSteg === tilsynOgPleieSteg) {
                oppdaterVurderingsoversikt();
            } else {
                navigerTilNesteSteg(nesteSteg);
            }
        });
    };

    const setMargin = () => {
        if (vurderingsoversikt.harPerioderSomSkalVurderes() || !harGyldigSignatur) {
            return Margin.medium;
        }
        return null;
    };

    const defaultPerioder =
        resterendeVurderingsperioderDefaultValue.length > 0
            ? resterendeVurderingsperioderDefaultValue
            : [new Period('', '')];

    const skalViseOpprettVurderingKnapp =
        !vurderingsoversikt?.harPerioderSomSkalVurderes() && !visRadForNyVurdering && harGyldigSignatur;

    return (
        <PageContainer isLoading={isLoading} hasError={vurderingsoversiktFeilet} key={StepId.TilsynOgPleie}>
            <VurderingsoversiktMessages
                vurderingsoversikt={vurderingsoversikt}
                harGyldigSignatur={harGyldigSignatur}
                vurderingstype={Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE}
            />
            {vurderingsoversikt?.harPerioderÅVise() && (
                <Box marginTop={setMargin()}>
                    <NavigationWithDetailView
                        navigationSection={() => (
                            <Vurderingsnavigasjon
                                vurderingselementer={vurderingsoversikt?.vurderingselementer}
                                resterendeVurderingsperioder={vurderingsoversikt?.resterendeVurderingsperioder}
                                onVurderingValgt={velgVurderingselement}
                                onNyVurderingClick={visNyVurderingForm}
                                visRadForNyVurdering={visRadForNyVurdering}
                                visParterLabel
                                visOpprettVurderingKnapp={skalViseOpprettVurderingKnapp}
                            />
                        )}
                        showDetailSection={visVurderingDetails}
                        detailSection={() => {
                            const harValgtVurderingselement = !!valgtVurderingselement;
                            const opprettLink = findLinkByRel(LinkRel.OPPRETT_VURDERING, vurderingsoversikt.links);
                            return (
                                <>
                                    {harValgtVurderingselement && (
                                        <VurderingsdetaljerController
                                            vurderingselement={valgtVurderingselement}
                                            vurderingstype={Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE}
                                            contentRenderer={(vurdering) => {
                                                if (erRedigeringsmodus) {
                                                    const vurderingsversjon = vurdering.versjoner[0];
                                                    const initialState = buildInitialFormStateForKontinuerligTilsynForEdit(
                                                        vurderingsversjon
                                                    );
                                                    return (
                                                        <EndreVurderingController
                                                            vurderingsid={vurdering.id}
                                                            vurderingstype={Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE}
                                                            endreVurderingLink={findLinkByRel(
                                                                LinkRel.ENDRE_VURDERING,
                                                                (valgtVurderingselement as ManuellVurdering)?.links
                                                            )}
                                                            dataTilVurderingUrl={endpoints.dataTilVurdering}
                                                            onVurderingLagret={onVurderingLagret}
                                                            vurderingsversjonId={vurderingsversjon.versjon}
                                                            formRenderer={(dokumenter, onSubmit) => (
                                                                <VurderingAvTilsynsbehovForm
                                                                    defaultValues={initialState}
                                                                    resterendeVurderingsperioder={
                                                                        resterendeVurderingsperioderDefaultValue
                                                                    }
                                                                    perioderSomKanVurderes={
                                                                        vurderingsoversikt.perioderSomKanVurderes
                                                                    }
                                                                    dokumenter={dokumenter}
                                                                    onSubmit={onSubmit}
                                                                    onAvbryt={
                                                                        visRadForNyVurdering ? onAvbryt : undefined
                                                                    }
                                                                />
                                                            )}
                                                        />
                                                    );
                                                }

                                                return (
                                                    <VurderingsoppsummeringForKontinuerligTilsynOgPleie
                                                        vurdering={vurdering}
                                                        redigerVurdering={redigerVurdering}
                                                    />
                                                );
                                            }}
                                        />
                                    )}
                                    <div style={{ display: harValgtVurderingselement ? 'none' : '' }}>
                                        <NyVurderingController
                                            vurderingstype={Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE}
                                            opprettVurderingLink={opprettLink}
                                            dataTilVurderingUrl={endpoints.dataTilVurdering}
                                            onVurderingLagret={onVurderingLagret}
                                            formRenderer={(dokumenter, onSubmit) => (
                                                <VurderingAvTilsynsbehovForm
                                                    defaultValues={{
                                                        [FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
                                                        [FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: undefined,
                                                        [FieldName.PERIODER]: defaultPerioder,
                                                        [FieldName.DOKUMENTER]: [],
                                                    }}
                                                    resterendeVurderingsperioder={
                                                        resterendeVurderingsperioderDefaultValue
                                                    }
                                                    perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
                                                    dokumenter={dokumenter}
                                                    onSubmit={onSubmit}
                                                    onAvbryt={visRadForNyVurdering ? onAvbryt : undefined}
                                                />
                                            )}
                                        />
                                    </div>
                                </>
                            );
                        }}
                    />
                </Box>
            )}
        </PageContainer>
    );
};

export default VilkårsvurderingAvTilsynOgPleie;
