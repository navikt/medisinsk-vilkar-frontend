import axios from 'axios';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import React, { useMemo } from 'react';
import LinkRel from '../../../constants/LinkRel';
import { Period } from '../../../types/Period';
import Step, { StepId, toOmsorgspersonerSteg } from '../../../types/Step';
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
import NyVurderingAvToOmsorgspersonerForm, {
    FieldName,
} from '../ny-vurdering-av-to-omsorgspersoner-form/NyVurderingAvToOmsorgspersonerForm';
import NyVurderingController from '../ny-vurdering-controller/NyVurderingController';
import PageContainer from '../page-container/PageContainer';
import VurderingsdetaljerController from '../vurderingsdetaljer-controller/VurderingsdetaljerController';
import Vurderingsnavigasjon from '../vurderingsnavigasjon/Vurderingsnavigasjon';
import VurderingsoversiktMessages from '../vurderingsoversikt-messages/VurderingsoversiktMessages';
import ActionType from './actionTypes';
import vilkårsvurderingReducer from './reducer';

interface VilkårsvurderingAvTilsynOgPleieProps {
    navigerTilNesteSteg: (steg: Step) => void;
    hentSykdomsstegStatus: () => Promise<SykdomsstegStatusResponse>;
    sykdomsstegStatus: SykdomsstegStatusResponse;
}

const VilkårsvurderingAvToOmsorgspersoner = ({
    navigerTilNesteSteg,
    hentSykdomsstegStatus,
    sykdomsstegStatus,
}: VilkårsvurderingAvTilsynOgPleieProps): JSX.Element => {
    const { endpoints, onFinished, httpErrorHandler, readOnly } = React.useContext(ContainerContext);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    const [state, dispatch] = React.useReducer(vilkårsvurderingReducer, {
        visVurderingDetails: false,
        isLoading: true,
        vurderingsoversikt: null,
        valgtVurderingselement: null,
        resterendeVurderingsperioderDefaultValue: [],
        vurderingsoversiktFeilet: false,
        visRadForNyVurdering: false,
    });

    const {
        vurderingsoversikt,
        isLoading,
        visVurderingDetails,
        valgtVurderingselement,
        resterendeVurderingsperioderDefaultValue,
        vurderingsoversiktFeilet,
        visRadForNyVurdering,
    } = state;

    const { manglerGodkjentLegeerklæring } = sykdomsstegStatus;
    const harGyldigSignatur = !manglerGodkjentLegeerklæring;

    const getVurderingsoversikt = () =>
        get<Vurderingsoversikt>(endpoints.vurderingsoversiktBehovForToOmsorgspersoner, httpErrorHandler, {
            cancelToken: httpCanceler.token,
        });

    const visVurderingsoversikt = (nyVurderingsoversikt: Vurderingsoversikt) => {
        dispatch({ type: ActionType.VIS_VURDERINGSOVERSIKT, vurderingsoversikt: nyVurderingsoversikt });
    };

    const handleError = () => {
        dispatch({ type: ActionType.VURDERINGSOVERSIKT_FEILET });
    };

    const visNyVurderingForm = (resterendeVurderingsperioder?: Period[]) => {
        dispatch({ type: ActionType.VIS_NY_VURDERING_FORM, resterendeVurderingsperioder });
    };

    const onAvbryt = () => {
        dispatch({
            type: ActionType.AVBRYT_FORM,
        });
    };

    const åpneFørstePeriodeSomMåBehandles = (nyVurderingsoversikt: Vurderingsoversikt) => {
        const harEnPeriodeSomMåBehandles = nyVurderingsoversikt?.resterendeVurderingsperioder?.length > 0;

        if (harEnPeriodeSomMåBehandles) {
            visNyVurderingForm(nyVurderingsoversikt.finnResterendeVurderingsperioder());
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

    const velgVurderingselement = (nyvalgtVurderingselement: Vurderingselement) => {
        dispatch({ type: ActionType.VELG_VURDERINGSELEMENT, valgtVurderingselement: nyvalgtVurderingselement });
    };

    const oppdaterVurderingsoversikt = () => {
        dispatch({ type: ActionType.PENDING });
        getVurderingsoversikt().then((vurderingsoversiktData) => {
            const nyVurderingsoversikt = new Vurderingsoversikt(vurderingsoversiktData);
            visVurderingsoversikt(nyVurderingsoversikt);
        });
    };

    const onVurderingLagret = () => {
        dispatch({ type: ActionType.PENDING });
        hentSykdomsstegStatus().then((status) => {
            if (status.kanLøseAksjonspunkt) {
                onFinished(); // TODO: Skal vi prøve å gå videre her eller skal vi sjekke om vi har valgrfrie perioder som kan vurderes og gjøre oppdaterVurderingsoversikt() istedet?
                return;
            }

            const nesteSteg = finnNesteSteg(status);
            if (nesteSteg === toOmsorgspersonerSteg) {
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

    const skalViseValgfriePerioder = !readOnly && vurderingsoversikt?.resterendeValgfrieVurderingsperioder.length > 0;

    const defaultPerioder = () => {
        if (resterendeVurderingsperioderDefaultValue?.length > 0) {
            return resterendeVurderingsperioderDefaultValue;
        }
        if (skalViseValgfriePerioder) {
            return vurderingsoversikt.finnResterendeValgfrieVurderingsperioder();
        }
        return [new Period('', '')];
    };

    const skalViseOpprettVurderingKnapp =
        !vurderingsoversikt?.harPerioderSomSkalVurderes() && !visRadForNyVurdering && harGyldigSignatur;

    return (
        <PageContainer hasError={vurderingsoversiktFeilet} isLoading={isLoading} key={StepId.ToOmsorgspersoner}>
            {vurderingsoversikt?.harIngenPerioderÅVise() && (
                <Box marginTop={Margin.large} marginBottom={Margin.large}>
                    <AlertStripeInfo>
                        To omsorgspersoner skal kun vurderes dersom det er flere parter som har søkt i samme periode,
                        eller det er opplyst i søknaden om at det kommer en søker til.
                    </AlertStripeInfo>
                </Box>
            )}
            <VurderingsoversiktMessages
                vurderingsoversikt={vurderingsoversikt}
                harGyldigSignatur={harGyldigSignatur}
                vurderingstype={Vurderingstype.TO_OMSORGSPERSONER}
            />
            {vurderingsoversikt?.harPerioderÅVise() && (
                <Box marginTop={setMargin()}>
                    <NavigationWithDetailView
                        navigationSection={() => {
                            if (vurderingsoversikt.harPerioderÅVise()) {
                                return (
                                    <Vurderingsnavigasjon
                                        vurderingselementer={vurderingsoversikt?.vurderingselementer}
                                        resterendeVurderingsperioder={vurderingsoversikt?.finnResterendeVurderingsperioder()}
                                        onVurderingValgt={velgVurderingselement}
                                        onNyVurderingClick={visNyVurderingForm}
                                        visRadForNyVurdering={visRadForNyVurdering}
                                        visOpprettVurderingKnapp={skalViseOpprettVurderingKnapp}
                                        resterendeValgfrieVurderingsperioder={
                                            skalViseValgfriePerioder
                                                ? vurderingsoversikt?.finnResterendeValgfrieVurderingsperioder()
                                                : []
                                        }
                                    />
                                );
                            }
                            return null;
                        }}
                        showDetailSection={visVurderingDetails}
                        detailSection={() => {
                            const harValgtVurderingselement = !!valgtVurderingselement;
                            const opprettLink = findLinkByRel(LinkRel.OPPRETT_VURDERING, vurderingsoversikt.links);
                            return (
                                <>
                                    {harValgtVurderingselement && (
                                        <VurderingsdetaljerController
                                            vurderingselement={valgtVurderingselement}
                                            vurderingstype={Vurderingstype.TO_OMSORGSPERSONER}
                                        />
                                    )}
                                    <div style={{ display: harValgtVurderingselement ? 'none' : '' }}>
                                        <NyVurderingController
                                            vurderingstype={Vurderingstype.TO_OMSORGSPERSONER}
                                            opprettVurderingLink={opprettLink}
                                            dataTilVurderingUrl={endpoints.dataTilVurdering}
                                            onVurderingLagret={onVurderingLagret}
                                            formRenderer={(dokumenter, onSubmit) => (
                                                <NyVurderingAvToOmsorgspersonerForm
                                                    defaultValues={{
                                                        [FieldName.VURDERING_AV_TO_OMSORGSPERSONER]: '',
                                                        [FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: undefined,
                                                        [FieldName.PERIODER]: defaultPerioder(),
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

export default VilkårsvurderingAvToOmsorgspersoner;
