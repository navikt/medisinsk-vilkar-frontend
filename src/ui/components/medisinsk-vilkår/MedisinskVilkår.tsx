import { get } from '@navikt/k9-http-utils';
import { PageContainer, WarningIcon, Infostripe, ChildIcon, Margin, Box } from '@navikt/k9-react-components';
import React, { useMemo } from 'react';
import { TabsPure } from 'nav-frontend-tabs';
import classnames from 'classnames';
import axios from 'axios';
import StruktureringAvDokumentasjon from '../strukturering-av-dokumentasjon/StruktureringAvDokumentasjon';
import VilkårsvurderingAvTilsynOgPleie from '../vilkårsvurdering-av-tilsyn-og-pleie/VilkårsvurderingAvTilsynOgPleie';
import VilkårsvurderingAvToOmsorgspersoner from '../vilkårsvurdering-av-to-omsorgspersoner/VilkårsvurderingAvToOmsorgspersoner';
import Step, { dokumentSteg, tilsynOgPleieSteg, toOmsorgspersonerSteg } from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import ContainerContext from '../../context/ContainerContext';
import { finnNesteSteg } from '../../../util/statusUtils';
import medisinskVilkårReducer from './reducer';
import ActionType from './actionTypes';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import AksjonspunktFerdigStripe from '../aksjonspunkt-ferdig-stripe/AksjonspunktFerdigStripe';
import VurderingContext from '../../context/VurderingContext';
import Vurderingstype from '../../../types/Vurderingstype';
import { NyeDokumenterResponse } from '../../../types/NyeDokumenterResponse';
import NyeDokumenterSomKanPåvirkeEksisterendeVurderingerController from '../nye-dokumenter-som-kan-påvirke-eksisterende-vurderinger-controller/NyeDokumenterSomKanPåvirkeEksisterendeVurderingerController';
import Dokument from '../../../types/Dokument';
import styles from './medisinskVilkår.less';

const steps: Step[] = [dokumentSteg, tilsynOgPleieSteg, toOmsorgspersonerSteg];

interface TabItemProps {
    label: string;
    showWarningIcon: boolean;
}

const TabItem = ({ label, showWarningIcon }: TabItemProps) => {
    const cls = classnames(styles.medisinskVilkårTabItem, {
        [styles.medisinskVilkårTabItemExtended]: showWarningIcon,
    });
    return (
        <div className={cls}>
            {label}
            {showWarningIcon && (
                <div className={styles.medisinskVilkårTabItem__warningIcon}>
                    <WarningIcon />
                </div>
            )}
        </div>
    );
};

const MedisinskVilkår = (): JSX.Element => {
    const [state, dispatch] = React.useReducer(medisinskVilkårReducer, {
        isLoading: true,
        hasError: null,
        activeStep: null,
        markedStep: null,
        sykdomsstegStatus: null,
        nyeDokumenterSomIkkeErVurdert: [],
    });

    const { isLoading, hasError, activeStep, markedStep, sykdomsstegStatus, nyeDokumenterSomIkkeErVurdert } = state;

    const { endpoints, httpErrorHandler, visFortsettknapp } = React.useContext(ContainerContext);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    const hentSykdomsstegStatus = async () => {
        try {
            const status = await get<SykdomsstegStatusResponse>(endpoints.status, httpErrorHandler, {
                cancelToken: httpCanceler.token,
            });
            dispatch({
                type: ActionType.UPDATE_STATUS,
                sykdomsstegStatus: status,
            });
            return status;
        } catch (error) {
            dispatch({
                type: ActionType.SHOW_ERROR
            })
            throw new Error(error);
        }
    };

    const hentNyeDokumenterSomIkkeErVurdertHvisNødvendig = (status): Promise<[SykdomsstegStatusResponse, Dokument[]]> =>
        new Promise((resolve, reject) => {
            if (status.nyttDokumentHarIkkekontrollertEksisterendeVurderinger) {
                get<NyeDokumenterResponse>(endpoints.nyeDokumenter, httpErrorHandler, {
                    cancelToken: httpCanceler.token,
                }).then(
                    (dokumenter) => resolve([status, dokumenter]),
                    (error) => reject(error)
                );
            } else {
                resolve([status, []]);
            }
        });

    React.useEffect(() => {
        hentSykdomsstegStatus()
            .then(hentNyeDokumenterSomIkkeErVurdertHvisNødvendig)
            .then(([sykdomsstegStatusResponse, nyeDokumenterSomIkkeErVurdertResponse]) => {
                const step = finnNesteSteg(sykdomsstegStatusResponse);
                if (step !== null) {
                    dispatch({
                        type: ActionType.MARK_AND_ACTIVATE_STEP,
                        step,
                        nyeDokumenterSomIkkeErVurdert: nyeDokumenterSomIkkeErVurdertResponse,
                    });
                } else {
                    dispatch({
                        type: ActionType.ACTIVATE_DEFAULT_STEP,
                        nyeDokumenterSomIkkeErVurdert: nyeDokumenterSomIkkeErVurdertResponse,
                    });
                }
            });

        return () => {
            httpCanceler.cancel();
        };
    }, []);

    const navigerTilNesteSteg = () => {
        const nesteSteg = finnNesteSteg(sykdomsstegStatus);
        dispatch({ type: ActionType.NAVIGATE_TO_STEP, step: nesteSteg });
    };

    const navigerTilSteg = (nesteSteg: Step, ikkeMarkerSteg?: boolean) => {
        if (sykdomsstegStatus.kanLøseAksjonspunkt || ikkeMarkerSteg) {
            dispatch({ type: ActionType.ACTIVATE_STEP_AND_CLEAR_MARKING, step: nesteSteg });
        } else {
            dispatch({ type: ActionType.NAVIGATE_TO_STEP, step: nesteSteg });
        }
    };

    const afterEndringerUtifraNyeDokumenterRegistrert = () => {
        dispatch({ type: ActionType.ENDRINGER_UTIFRA_NYE_DOKUMENTER_REGISTRERT });
        hentSykdomsstegStatus().then(({ kanLøseAksjonspunkt }) => {
            if (kanLøseAksjonspunkt) {
                navigerTilSteg(toOmsorgspersonerSteg, true);
            }
        });
    };

    const kanLøseAksjonspunkt = sykdomsstegStatus?.kanLøseAksjonspunkt;
    const harDataSomIkkeHarBlittTattMedIBehandling = sykdomsstegStatus?.harDataSomIkkeHarBlittTattMedIBehandling;
    const manglerVurderingAvNyeDokumenter = sykdomsstegStatus?.nyttDokumentHarIkkekontrollertEksisterendeVurderinger;

    return (
        <PageContainer isLoading={isLoading} hasError={hasError}>
            <Infostripe
                text="Sykdomsvurderingen gjelder barnet og er felles for alle parter."
                iconRenderer={() => <ChildIcon />}
            />
            <div className={styles.medisinskVilkår}>
                <h1 style={{ fontSize: 22 }}>Sykdom</h1>
                <WriteAccessBoundContent
                    contentRenderer={() => (
                        <Box marginBottom={Margin.medium}>
                            <NyeDokumenterSomKanPåvirkeEksisterendeVurderingerController
                                dokumenter={nyeDokumenterSomIkkeErVurdert}
                                afterEndringerRegistrert={afterEndringerUtifraNyeDokumenterRegistrert}
                            />
                        </Box>
                    )}
                    otherRequirementsAreMet={
                        nyeDokumenterSomIkkeErVurdert && manglerVurderingAvNyeDokumenter && markedStep !== dokumentSteg
                    }
                />
                <WriteAccessBoundContent
                    contentRenderer={() => <AksjonspunktFerdigStripe />}
                    otherRequirementsAreMet={
                        kanLøseAksjonspunkt && (harDataSomIkkeHarBlittTattMedIBehandling || visFortsettknapp === true)
                    }
                />
                <TabsPure
                    kompakt
                    tabs={steps.map((step) => ({
                        label: <TabItem label={step.title} showWarningIcon={step === markedStep} />,
                        aktiv: step === activeStep,
                    }))}
                    onChange={(event, clickedIndex) => {
                        dispatch({ type: ActionType.ACTIVATE_STEP, step: steps[clickedIndex] });
                    }}
                />
                <div style={{ marginTop: '1rem', maxWidth: '1204px' }}>
                    <div className={styles.medisinskVilkår__vilkårContentContainer}>
                        {activeStep === dokumentSteg && (
                            <StruktureringAvDokumentasjon
                                navigerTilNesteSteg={navigerTilNesteSteg}
                                hentSykdomsstegStatus={() =>
                                    hentSykdomsstegStatus()
                                        .then(hentNyeDokumenterSomIkkeErVurdertHvisNødvendig)
                                        .then(([status, dokumenter]) => {
                                            dispatch({
                                                type: ActionType.UPDATE_NYE_DOKUMENTER_SOM_IKKE_ER_VURDERT,
                                                nyeDokumenterSomIkkeErVurdert: dokumenter,
                                            });
                                            return [status, dokumenter];
                                        })
                                }
                                sykdomsstegStatus={sykdomsstegStatus}
                            />
                        )}
                        {activeStep === tilsynOgPleieSteg && (
                            <VurderingContext.Provider
                                value={{ vurderingstype: Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE }}
                            >
                                <VilkårsvurderingAvTilsynOgPleie
                                    navigerTilNesteSteg={navigerTilSteg}
                                    hentSykdomsstegStatus={hentSykdomsstegStatus}
                                    sykdomsstegStatus={sykdomsstegStatus}
                                />
                            </VurderingContext.Provider>
                        )}
                        {activeStep === toOmsorgspersonerSteg && (
                            <VurderingContext.Provider value={{ vurderingstype: Vurderingstype.TO_OMSORGSPERSONER }}>
                                <VilkårsvurderingAvToOmsorgspersoner
                                    navigerTilNesteSteg={navigerTilSteg}
                                    hentSykdomsstegStatus={hentSykdomsstegStatus}
                                    sykdomsstegStatus={sykdomsstegStatus}
                                />
                            </VurderingContext.Provider>
                        )}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default MedisinskVilkår;
