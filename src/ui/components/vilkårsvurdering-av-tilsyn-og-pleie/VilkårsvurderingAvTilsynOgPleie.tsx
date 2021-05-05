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
import { findHrefByRel, findLinkByRel } from '../../../util/linkUtils';
import { finnNesteSteg } from '../../../util/statusUtils';
import ContainerContext from '../../context/ContainerContext';
import Box, { Margin } from '../box/Box';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import VurderingAvTilsynsbehovForm, { FieldName } from '../vurdering-av-tilsynsbehov-form/VurderingAvTilsynsbehovForm';
import NyVurderingController from '../ny-vurdering-controller/NyVurderingController';
import PageContainer from '../page-container/PageContainer';
import Vurderingsnavigasjon from '../vurderingsnavigasjon/Vurderingsnavigasjon';
import VurderingsoversiktMessages from '../vurderingsoversikt-messages/VurderingsoversiktMessages';
import ActionType from './actionTypes';
import vilkårsvurderingReducer from './reducer';
import VurderingsoppsummeringForKontinuerligTilsynOgPleie from '../vurderingsoppsummering-for-kontinuerlig-tilsyn-og-pleie/VurderingsoppsummeringForKontinuerligTilsynOgPleie';
import ManuellVurdering from '../../../types/ManuellVurdering';
import { buildInitialFormStateForEdit } from './initialFormStateUtil';
import EndreVurdering from '../endre-vurdering/EndreVurdering';
import VurderingsdetaljerFetcher from '../vurderingsdetaljer-fetcher/VurderingsdetaljerFetcher';

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
        editMode: false,
    });

    const {
        vurderingsoversikt,
        isLoading,
        visVurderingDetails,
        valgtVurderingselement,
        resterendeVurderingsperioderDefaultValue,
        visRadForNyVurdering,
        vurderingsoversiktFeilet,
        editMode,
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
        dispatch({ type: ActionType.ACTIVATE_EDIT_MODE });
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

    const endreVurderingFormRenderer = (dokumenter, onSubmit, vurderingsversjon) => (
        <VurderingAvTilsynsbehovForm
            defaultValues={buildInitialFormStateForEdit(vurderingsversjon)}
            resterendeVurderingsperioder={resterendeVurderingsperioderDefaultValue}
            perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
            dokumenter={dokumenter}
            onSubmit={onSubmit}
            onAvbryt={visRadForNyVurdering ? onAvbryt : undefined}
        />
    );

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

                            if (harValgtVurderingselement) {
                                const manuellVurdering = valgtVurderingselement as ManuellVurdering;
                                const url = findHrefByRel(LinkRel.HENT_VURDERING, manuellVurdering.links);
                                return (
                                    <VurderingsdetaljerFetcher
                                        url={url}
                                        contentRenderer={(vurdering) => {
                                            if (editMode) {
                                                const vurderingsversjon = vurdering.versjoner[0];
                                                return (
                                                    <EndreVurdering
                                                        vurderingselement={manuellVurdering}
                                                        vurderingsversjon={vurderingsversjon}
                                                        onVurderingLagret={onVurderingLagret}
                                                        formRenderer={(dokumenter, onSubmit) =>
                                                            endreVurderingFormRenderer(
                                                                dokumenter,
                                                                onSubmit,
                                                                vurderingsversjon
                                                            )
                                                        }
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
                                );
                            }

                            return (
                                <>
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
