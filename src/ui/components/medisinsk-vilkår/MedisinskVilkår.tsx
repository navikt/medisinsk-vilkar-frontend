import { get } from '@navikt/k9-http-utils';
import { PageContainer, WarningIcon, Infostripe, ChildIcon } from '@navikt/k9-react-components';
import React, { useMemo, useState } from 'react';
import { TabsPure } from 'nav-frontend-tabs';
import classnames from 'classnames';
import axios from 'axios';
import StruktureringAvDokumentasjon from '../strukturering-av-dokumentasjon/StruktureringAvDokumentasjon';
import VilkårsvurderingAvTilsynOgPleie from '../vilkårsvurdering-av-tilsyn-og-pleie/VilkårsvurderingAvTilsynOgPleie';
import VilkårsvurderingAvToOmsorgspersoner from '../vilkårsvurdering-av-to-omsorgspersoner/VilkårsvurderingAvToOmsorgspersoner';
import Step, { dokumentSteg, tilsynOgPleieSteg, toOmsorgspersonerSteg } from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import ContainerContext from '../../context/ContainerContext';
import DiagnosekodeContext from '../../context/DiagnosekodeContext';
import { finnNesteSteg } from '../../../util/statusUtils';
import medisinskVilkårReducer from './reducer';
import ActionType from './actionTypes';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import AksjonspunktFerdigStripe from '../aksjonspunkt-ferdig-stripe/AksjonspunktFerdigStripe';
import VurderingContext from '../../context/VurderingContext';
import Vurderingstype from '../../../types/Vurderingstype';
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
    });

    const { isLoading, hasError, activeStep, markedStep, sykdomsstegStatus } = state;
    const [diagnosekoder, setDiagnosekoder] = useState({ koder: [],  hasLoaded: false });
    const diagnosekoderTekst = diagnosekoder.koder.length > 0 ? `${diagnosekoder?.koder.join(', ')}` : 'Kode mangler';
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
                type: ActionType.SHOW_ERROR,
            });
            throw new Error(error);
        }
    };

    React.useEffect(() => {
        hentSykdomsstegStatus().then(
            (status) => {
                const steg = finnNesteSteg(status);
                dispatch({
                    type: ActionType.MARK_AND_ACTIVATE_STEP,
                    step: steg,
                });
            },
            () => {
                dispatch({ type: ActionType.ACTIVATE_DEFAULT_STEP });
            }
        );
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

    return (
        <PageContainer isLoading={isLoading} hasError={hasError}>
            <Infostripe
                element={
                    <>
                        <span>Sykdomsvurderingen gjelder barnet og er felles for alle parter.</span>
                        <span className={styles.infostripe__diagnosekode__tittel}>Diagnose:</span>
                        <span className={styles.infostripe__diagnosekode}>
                            { (!diagnosekoder?.hasLoaded && ' ') || diagnosekoderTekst}
                        </span>
                    </>
                }
                iconRenderer={() => <ChildIcon />}
            />
            <div className={styles.medisinskVilkår}>
                <h1 style={{ fontSize: 22 }}>Sykdom</h1>
                <WriteAccessBoundContent
                    contentRenderer={() => <AksjonspunktFerdigStripe />}
                    otherRequirementsAreMet={
                        sykdomsstegStatus?.kanLøseAksjonspunkt &&
                        (sykdomsstegStatus?.harDataSomIkkeHarBlittTattMedIBehandling || visFortsettknapp === true)
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
                            <DiagnosekodeContext.Provider value={setDiagnosekoder}>
                                <StruktureringAvDokumentasjon
                                    navigerTilNesteSteg={navigerTilNesteSteg}
                                    hentSykdomsstegStatus={hentSykdomsstegStatus}
                                    sykdomsstegStatus={sykdomsstegStatus}
                                />
                            </DiagnosekodeContext.Provider>
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
