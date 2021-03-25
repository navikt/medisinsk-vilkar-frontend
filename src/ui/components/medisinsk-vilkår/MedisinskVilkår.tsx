import React, { useMemo } from 'react';
import { TabsPure } from 'nav-frontend-tabs';
import classnames from 'classnames';
import axios from 'axios';
import Infostripe from '../infostripe/Infostripe';
import StruktureringAvDokumentasjon from '../strukturering-av-dokumentasjon/StruktureringAvDokumentasjon';
import VilkårsvurderingAvTilsynOgPleie from '../vilkårsvurdering-av-tilsyn-og-pleie/VilkårsvurderingAvTilsynOgPleie';
import VilkårsvurderingAvToOmsorgspersoner from '../vilkårsvurdering-av-to-omsorgspersoner/VilkårsvurderingAvToOmsorgspersoner';
import styles from './medisinskVilkår.less';
import Step, { dokumentSteg, tilsynOgPleieSteg, toOmsorgspersonerSteg } from '../../../types/Step';
import { get } from '../../../util/httpUtils';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import ContainerContext from '../../context/ContainerContext';
import { finnNesteSteg } from '../../../util/statusUtils';
import PageContainer from '../page-container/PageContainer';
import WarningIcon from '../icons/WarningIcon';
import medisinskVilkårReducer from './reducer';
import ActionType from './actionTypes';

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

const MedisinskVilkår = () => {
    const [state, dispatch] = React.useReducer(medisinskVilkårReducer, {
        isLoading: true,
        activeStep: null,
        markedStep: null,
        harGyldigSignatur: null,
        harRegistrertDiagnosekode: null,
    });

    const { isLoading, activeStep, markedStep, harGyldigSignatur, harRegistrertDiagnosekode } = state;

    const { endpoints, httpErrorHandler } = React.useContext(ContainerContext);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    const hentSykdomsstegStatus = async () => {
        try {
            const status = await get<SykdomsstegStatusResponse>(endpoints.status, httpErrorHandler, {
                cancelToken: httpCanceler.token,
            });
            dispatch({
                type: ActionType.UPDATE_STATUS,
                harGyldigSignatur: status.manglerGodkjentLegeerklæring === false,
                harRegistrertDiagnosekode: status.manglerDiagnosekode === false,
            });
            return status;
        } catch (error) {
            console.error(error);
            return error;
        }
    };

    React.useEffect(() => {
        hentSykdomsstegStatus().then(
            (status) => {
                const steg = finnNesteSteg(status);
                dispatch({
                    type: ActionType.MARK_AND_ACTIVATE_STEP,
                    step: steg,
                    harGyldigSignatur: status.manglerGodkjentLegeerklæring === false,
                    harRegistrertDiagnosekode: status.manglerDiagnosekode === false,
                });
            },
            () => {
                dispatch({ type: ActionType.ACTIVATE_DEFAULT_STEP });
            }
        );
    }, []);

    const navigerTilSteg = (steg: Step) => {
        dispatch({ type: ActionType.NAVIGATE_TO_STEP, step: steg });
    };

    return (
        <PageContainer isLoading={isLoading}>
            <Infostripe />
            <div className={styles.medisinskVilkår}>
                <h1 style={{ fontSize: 22 }}>Sykdom</h1>
                <TabsPure
                    kompakt
                    tabs={steps.map((step) => {
                        return {
                            label: <TabItem label={step.title} showWarningIcon={step === markedStep} />,
                            aktiv: step === activeStep,
                        };
                    })}
                    onChange={(event, clickedIndex) => {
                        dispatch({ type: ActionType.ACTIVATE_STEP, step: steps[clickedIndex] });
                    }}
                />
                <div style={{ marginTop: '1rem', maxWidth: '1204px' }}>
                    <div className={styles.medisinskVilkår__vilkårContentContainer}>
                        {activeStep === dokumentSteg && (
                            <StruktureringAvDokumentasjon
                                navigerTilNesteSteg={navigerTilSteg}
                                hentSykdomsstegStatus={hentSykdomsstegStatus}
                                harRegistrertDiagnosekode={harRegistrertDiagnosekode}
                            />
                        )}
                        {activeStep === tilsynOgPleieSteg && (
                            <VilkårsvurderingAvTilsynOgPleie
                                navigerTilNesteSteg={navigerTilSteg}
                                hentSykdomsstegStatus={hentSykdomsstegStatus}
                                harGyldigSignatur={harGyldigSignatur}
                            />
                        )}
                        {activeStep === toOmsorgspersonerSteg && (
                            <VilkårsvurderingAvToOmsorgspersoner
                                navigerTilNesteSteg={navigerTilSteg}
                                hentSykdomsstegStatus={hentSykdomsstegStatus}
                                harGyldigSignatur={harGyldigSignatur}
                            />
                        )}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default MedisinskVilkår;
