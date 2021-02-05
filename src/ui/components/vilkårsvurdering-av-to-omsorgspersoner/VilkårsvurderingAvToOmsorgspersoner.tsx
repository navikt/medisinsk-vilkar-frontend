import axios from 'axios';
import Alertstripe, { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import Spinner from 'nav-frontend-spinner';
import React, { useMemo } from 'react';
import LinkRel from '../../../constants/LinkRel';
import { Period } from '../../../types/Period';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import Vurderingstype from '../../../types/Vurderingstype';
import { prettifyPeriod } from '../../../util/formats';
import { fetchData } from '../../../util/httpUtils';
import { findHrefByRel, findLinkByRel } from '../../../util/linkUtils';
import processVurderingsoversikt, {
    finnVurderingsperioderSomOverlapperMedNyeSøknadsperioder,
} from '../../../util/vurderingsoversiktUtils';
import ContainerContext from '../../context/ContainerContext';
import Box, { Margin } from '../box/Box';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import NyVurderingAvToOmsorgspersonerForm, {
    FieldName,
} from '../ny-vurdering-av-to-omsorgspersoner-form/NyVurderingAvToOmsorgspersonerForm';
import NyVurderingController from '../ny-vurdering-controller/NyVurderingController';
import OverlappendeSøknadsperiodePanel from '../overlappende-søknadsperiode-panel/OverlappendeSøknadsperiodePanel';
import PageError from '../page-error/PageError';
import VurderingsdetaljerController from '../vurderingsdetaljer-controller/VurderingsdetaljerController';
import Vurderingsnavigasjon from '../vurderingsnavigasjon/Vurderingsnavigasjon';
import VurderingsoppsummeringForToOmsorgspersoner from '../vurderingsoppsummering-for-to-omsorgspersoner/VurderingsoppsummeringForToOmsorgspersoner';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import ActionType from './actionTypes';
import vilkårsvurderingReducer from './reducer';

const VilkårsvurderingAvToOmsorgspersoner = (): JSX.Element => {
    const { vurdering, onVurderingValgt, endpoints, onFinished } = React.useContext(ContainerContext);
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

    const harPerioderSomSkalVurderes = vurderingsoversikt?.resterendeVurderingsperioder?.length > 0;
    const harVurdertePerioder = vurderingsoversikt?.vurderingselementer?.length > 0;
    const harGyldigSignatur = vurderingsoversikt && vurderingsoversikt.harGyldigSignatur === true;
    const overlappendeVurderingsperioder = finnVurderingsperioderSomOverlapperMedNyeSøknadsperioder(vurderingsoversikt);

    const getVurderingsoversikt = () => {
        return fetchData<Vurderingsoversikt>(endpoints.vurderingsoversiktBehovForToOmsorgspersoner, {
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

    const velgVurderingselement = (nyvalgtVurderingselement: Vurderingselement) => {
        onVurderingValgt(nyvalgtVurderingselement.id);
        dispatch({ type: ActionType.VELG_VURDERINGSELEMENT, valgtVurderingselement: nyvalgtVurderingselement });
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
                Du kan ikke vurdere behov for to omsorgspersoner før søker har sendt inn legeerklæring fra
                sykehus/spesialisthelsetjenesten.
            </Alertstripe>
        );
    }
    return (
        <div style={{ maxWidth: '1204px' }}>
            {harPerioderSomSkalVurderes && (
                <>
                    <AlertStripeAdvarsel>
                        {`Vurder behov for to omsorgspersoner for perioden ${prettifyPeriod(
                            vurderingsoversikt?.resterendeVurderingsperioder[0]
                        )}.`}
                    </AlertStripeAdvarsel>
                    {overlappendeVurderingsperioder && overlappendeVurderingsperioder.length > 0 && (
                        <Box marginTop={Margin.medium}>
                            <OverlappendeSøknadsperiodePanel
                                onProgressButtonClick={() => console.log('does something')}
                                overlappendeVurderingsperioder={overlappendeVurderingsperioder}
                            />
                        </Box>
                    )}
                </>
            )}

            {!harVurdertePerioder && !harPerioderSomSkalVurderes && (
                <Box marginTop={Margin.large}>
                    <AlertStripeInfo>
                        To omsorgspersoner skal kun vurderes dersom det er flere parter som har søkt i samme periode,
                        eller det er opplyst i søknaden om at det kommer en søker til.
                    </AlertStripeInfo>
                </Box>
            )}
            {!harPerioderSomSkalVurderes && (
                <Box marginBottom={Margin.large}>
                    <Alertstripe type="suksess">
                        {!harVurdertePerioder
                            ? 'Ingen perioder å vurdere'
                            : 'Behov for to omsorgspersoner er ferdig vurdert'}
                        <WriteAccessBoundContent
                            contentRenderer={() => (
                                <Knapp
                                    type="hoved"
                                    htmlType="button"
                                    style={{ marginLeft: '2rem' }}
                                    onClick={onFinished}
                                    mini
                                >
                                    Gå videre
                                </Knapp>
                            )}
                        />
                    </Alertstripe>
                </Box>
            )}
            <Box marginTop={harPerioderSomSkalVurderes || !harVurdertePerioder ? Margin.medium : null}>
                <NavigationWithDetailView
                    navigationSection={() => {
                        if (!harPerioderSomSkalVurderes && !harVurdertePerioder) {
                            return (
                                <Box marginTop={Margin.medium}>
                                    <AlertStripeInfo>
                                        To omsorgspersoner skal ikke vurderes før tilsyn og pleie er blitt innvilget og
                                        det er to parter i saken.
                                    </AlertStripeInfo>
                                </Box>
                            );
                        }
                        return (
                            <Vurderingsnavigasjon
                                vurderingselementer={vurderingsoversikt?.vurderingselementer}
                                resterendeVurderingsperioder={vurderingsoversikt?.resterendeVurderingsperioder}
                                onVurderingValgt={velgVurderingselement}
                                onNyVurderingClick={visNyVurderingForm}
                            />
                        );
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
                                            <VurderingsoppsummeringForToOmsorgspersoner vurdering={valgtVurdering} />
                                        )}
                                    />
                                );
                            }

                            const opprettLink = findLinkByRel(LinkRel.OPPRETT_VURDERING, vurderingsoversikt.links);
                            const dataTilVurderingUrl = findHrefByRel(
                                LinkRel.DATA_TIL_VURDERING,
                                vurderingsoversikt.links
                            );
                            return (
                                <NyVurderingController
                                    vurderingstype={Vurderingstype.TO_OMSORGSPERSONER}
                                    opprettVurderingLink={opprettLink}
                                    dataTilVurderingUrl={dataTilVurderingUrl}
                                    onVurderingLagret={oppdaterVurderingsoversikt}
                                    formRenderer={(dokumenter, onSubmit) => (
                                        <NyVurderingAvToOmsorgspersonerForm
                                            defaultValues={{
                                                [FieldName.VURDERING_AV_TO_OMSORGSPERSONER]: '',
                                                [FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: undefined,
                                                [FieldName.PERIODER]: resterendeVurderingsperioderDefaultValue,
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
        </div>
    );
};

export default VilkårsvurderingAvToOmsorgspersoner;
