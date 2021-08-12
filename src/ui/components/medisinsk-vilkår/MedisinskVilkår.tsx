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
        activeStep: null,
        markedStep: null,
        sykdomsstegStatus: null,
        nyeDokumenterSomIkkeErVurdert: [],
    });

    const { isLoading, activeStep, markedStep, sykdomsstegStatus, nyeDokumenterSomIkkeErVurdert } = state;

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
            throw new Error(error);
        }
    };

    const hentNyeDokumenterSomIkkeErVurdertHvisNødvendig = (status) =>
        new Promise((resolve, reject) => {
            if (status.nyttDokumentHarIkkekontrollertEksisterendeVurderinger) {
                get<NyeDokumenterResponse>(endpoints.nyeDokumenter, httpErrorHandler, {
                    cancelToken: httpCanceler.token,
                }).then(
                    (nyeDokumenterResponse) => resolve([status, nyeDokumenterResponse]),
                    (error) => reject(error)
                );
            } else {
                resolve([status, []]);
            }
        });

    const oppdaterSykdomsstegStatus = () =>
        hentSykdomsstegStatus()
            .then(hentNyeDokumenterSomIkkeErVurdertHvisNødvendig)
            .then(
                ([status, nyeDokumenterSomIkkeErVurdertResponse]) => {
                    const steg = activeStep === dokumentSteg ? dokumentSteg : finnNesteSteg(status);
                    dispatch({
                        type: ActionType.MARK_AND_ACTIVATE_STEP,
                        step: steg,
                        nyeDokumenterSomIkkeErVurdert: nyeDokumenterSomIkkeErVurdertResponse,
                    });
                    return status;
                },
                () => {
                    dispatch({ type: ActionType.ACTIVATE_DEFAULT_STEP });
                }
            );

    const afterEndringerUtifraNyeDokumenterRegistrert = () => {
        dispatch({ type: ActionType.ENDRINGER_UTIFRA_NYE_DOKUMENTER_REGISTRERT });
        hentSykdomsstegStatus();
    };

    React.useEffect(() => {
        oppdaterSykdomsstegStatus();
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

    const kanLøseAksjonspunkt = sykdomsstegStatus?.kanLøseAksjonspunkt;
    const harDataSomIkkeHarBlittTattMedIBehandling = sykdomsstegStatus?.harDataSomIkkeHarBlittTattMedIBehandling;
    const manglerVurderingAvNyeDokumenter = sykdomsstegStatus?.nyttDokumentHarIkkekontrollertEksisterendeVurderinger;

    return (
        <PageContainer isLoading={isLoading}>
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
                    otherRequirementsAreMet={manglerVurderingAvNyeDokumenter && markedStep !== dokumentSteg}
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
                                hentSykdomsstegStatus={oppdaterSykdomsstegStatus}
                                sykdomsstegStatus={sykdomsstegStatus}
                            />
                        )}
                        {activeStep === tilsynOgPleieSteg && (
                            <VurderingContext.Provider
                                value={{ vurderingstype: Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE }}
                            >
                                <VilkårsvurderingAvTilsynOgPleie
                                    navigerTilNesteSteg={navigerTilSteg}
                                    hentSykdomsstegStatus={oppdaterSykdomsstegStatus}
                                    sykdomsstegStatus={sykdomsstegStatus}
                                />
                            </VurderingContext.Provider>
                        )}
                        {activeStep === toOmsorgspersonerSteg && (
                            <VurderingContext.Provider value={{ vurderingstype: Vurderingstype.TO_OMSORGSPERSONER }}>
                                <VilkårsvurderingAvToOmsorgspersoner
                                    navigerTilNesteSteg={navigerTilSteg}
                                    hentSykdomsstegStatus={oppdaterSykdomsstegStatus}
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
