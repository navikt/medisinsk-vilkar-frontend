import axios from 'axios';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import React, { useMemo } from 'react';
import LinkRel from '../../../constants/LinkRel';
import { Period } from '../../../types/Period';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import Vurderingstype from '../../../types/Vurderingstype';
import { get } from '../../../util/httpUtils';
import { findHrefByRel, findLinkByRel } from '../../../util/linkUtils';
import ContainerContext from '../../context/ContainerContext';
import Box, { Margin } from '../box/Box';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import NyVurderingAvToOmsorgspersonerForm, {
    FieldName,
} from '../ny-vurdering-av-to-omsorgspersoner-form/NyVurderingAvToOmsorgspersonerForm';
import NyVurderingController from '../ny-vurdering-controller/NyVurderingController';
import VurderingsdetaljerController from '../vurderingsdetaljer-controller/VurderingsdetaljerController';
import Vurderingsnavigasjon from '../vurderingsnavigasjon/Vurderingsnavigasjon';
import VurderingsoppsummeringForToOmsorgspersoner from '../vurderingsoppsummering-for-to-omsorgspersoner/VurderingsoppsummeringForToOmsorgspersoner';
import ActionType from './actionTypes';
import vilkårsvurderingReducer from './reducer';
import Step, { StepId, toOmsorgspersonerSteg } from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import { finnNesteSteg } from '../../../util/statusUtils';
import VurderingsoversiktMessages from '../vurderingsoversikt-messages/VurderingsoversiktMessages';
import PageContainer from '../page-container/PageContainer';

interface VilkårsvurderingAvTilsynOgPleieProps {
    navigerTilNesteSteg: (steg: Step) => void;
    hentSykdomsstegStatus: () => Promise<SykdomsstegStatusResponse>;
    harGyldigSignatur: boolean;
}

const VilkårsvurderingAvToOmsorgspersoner = ({
    navigerTilNesteSteg,
    hentSykdomsstegStatus,
    harGyldigSignatur,
}: VilkårsvurderingAvTilsynOgPleieProps): JSX.Element => {
    const { vurdering, onVurderingValgt, endpoints, onFinished, httpErrorHandler } = React.useContext(ContainerContext);
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

    const overlappendeVurderingsperioder =
        vurderingsoversikt?.finnVurderingsperioderSomOverlapperMedNyeSøknadsperioder() || [];

    const getVurderingsoversikt = () => {
        return get<Vurderingsoversikt>(endpoints.vurderingsoversiktBehovForToOmsorgspersoner, httpErrorHandler, {
            cancelToken: httpCanceler.token,
        });
    };

    const visVurderingsoversikt = (nyVurderingsoversikt: Vurderingsoversikt) => {
        dispatch({ type: ActionType.VIS_VURDERINGSOVERSIKT, vurderingsoversikt: nyVurderingsoversikt });
    };

    const handleError = () => {
        dispatch({ type: ActionType.VURDERINGSOVERSIKT_FEILET });
    };

    const visNyVurderingForm = (resterendeVurderingsperioder?: Period[]) => {
        onVurderingValgt(null);
        dispatch({ type: ActionType.VIS_NY_VURDERING_FORM, resterendeVurderingsperioder });
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

    const velgVurderingselement = (nyvalgtVurderingselement: Vurderingselement) => {
        onVurderingValgt(nyvalgtVurderingselement.id);
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
                onFinished();
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

    const defaultPerioder =
        resterendeVurderingsperioderDefaultValue?.length > 0
            ? resterendeVurderingsperioderDefaultValue
            : [new Period('', '')];

    return (
        <PageContainer hasError={vurderingsoversiktFeilet} isLoading={isLoading} key={StepId.ToOmsorgspersoner}>
            {vurderingsoversikt?.harIngenPerioderÅVise() && (
                <Box marginTop={Margin.large}>
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
                <Box
                    marginTop={
                        vurderingsoversikt.harPerioderSomSkalVurderes() || !harGyldigSignatur ? Margin.medium : null
                    }
                >
                    <NavigationWithDetailView
                        navigationSection={() => {
                            if (vurderingsoversikt.harPerioderÅVise()) {
                                return (
                                    <Vurderingsnavigasjon
                                        vurderingselementer={vurderingsoversikt?.vurderingselementer}
                                        resterendeVurderingsperioder={vurderingsoversikt?.resterendeVurderingsperioder}
                                        onVurderingValgt={velgVurderingselement}
                                        onNyVurderingClick={visNyVurderingForm}
                                    />
                                );
                            }
                            return null;
                        }}
                        detailSection={() => {
                            if (visVurderingDetails) {
                                if (valgtVurderingselement?.id) {
                                    const vurderingUrl = findHrefByRel(
                                        LinkRel.HENT_VURDERING,
                                        valgtVurderingselement.links
                                    );
                                    return (
                                        <VurderingsdetaljerController
                                            hentVurderingUrl={vurderingUrl}
                                            contentRenderer={(valgtVurdering) => (
                                                <VurderingsoppsummeringForToOmsorgspersoner
                                                    vurdering={valgtVurdering}
                                                />
                                            )}
                                        />
                                    );
                                }

                                const opprettLink = findLinkByRel(LinkRel.OPPRETT_VURDERING, vurderingsoversikt.links);
                                return (
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
                                                    [FieldName.PERIODER]: defaultPerioder,
                                                    [FieldName.DOKUMENTER]: [],
                                                }}
                                                resterendeVurderingsperioder={resterendeVurderingsperioderDefaultValue}
                                                perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
                                                dokumenter={dokumenter}
                                                onSubmit={onSubmit}
                                            />
                                        )}
                                    />
                                );
                            }
                            return null;
                        }}
                    />
                </Box>
            )}
        </PageContainer>
    );
};

export default VilkårsvurderingAvToOmsorgspersoner;
