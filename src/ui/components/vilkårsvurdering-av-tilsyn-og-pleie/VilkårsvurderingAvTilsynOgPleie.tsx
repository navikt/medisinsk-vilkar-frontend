import React, { useMemo } from 'react';
import axios from 'axios';
import { Period } from '../../../types/Period';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import ContainerContext from '../../context/ContainerContext';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import Vurderingsnavigasjon from '../vurderingsnavigasjon/Vurderingsnavigasjon';
import ActionType from './actionTypes';
import vilkårsvurderingReducer from './reducer';
import { get } from '../../../util/httpUtils';
import LinkRel from '../../../constants/LinkRel';
import { findHrefByRel, findLinkByRel } from '../../../util/linkUtils';
import NyVurderingController from '../ny-vurdering-controller/NyVurderingController';
import VurderingsdetaljerController from '../vurderingsdetaljer-controller/VurderingsdetaljerController';
import VurderingsoppsummeringForKontinuerligTilsynOgPleie from '../vurderingsoppsummering-for-kontinuerlig-tilsyn-og-pleie/VurderingsoppsummeringForKontinuerligTilsynOgPleie';
import NyVurderingAvTilsynsbehovForm, {
    FieldName,
} from '../ny-vurdering-av-tilsynsbehov-form/NyVurderingAvTilsynsbehovForm';
import Vurderingstype from '../../../types/Vurderingstype';
import PageContainer from '../page-container/PageContainer';
import Steg, { tilsynOgPleieSteg } from '../../../types/Steg';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import { finnNesteSteg } from '../../../util/statusUtils';
import VurderingsoversiktMessages from '../vurderingsoversikt-messages/VurderingsoversiktMessages';
import Box, { Margin } from '../box/Box';

interface VilkårsvurderingAvTilsynOgPleieProps {
    navigerTilNesteSteg: (steg: Steg) => void;
    hentSykdomsstegStatus: () => Promise<SykdomsstegStatusResponse>;
    harGyldigSignatur: boolean;
}

const VilkårsvurderingAvTilsynOgPleie = ({
    navigerTilNesteSteg,
    hentSykdomsstegStatus,
    harGyldigSignatur,
}: VilkårsvurderingAvTilsynOgPleieProps): JSX.Element => {
    const { vurdering, onVurderingValgt, endpoints, httpErrorHandler, onFinished } = React.useContext(ContainerContext);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    const [state, dispatch] = React.useReducer(vilkårsvurderingReducer, {
        visVurderingDetails: false,
        isLoading: true,
        vurderingsoversikt: null,
        valgtVurderingselement: null,
        resterendeVurderingsperioderDefaultValue: [],
        vurdering,
        visRadForNyVurdering: false,
        vurderingsoversiktFeilet: false,
    });

    const {
        vurderingsoversikt,
        isLoading,
        visVurderingDetails,
        valgtVurderingselement,
        resterendeVurderingsperioderDefaultValue,
        visRadForNyVurdering,
        vurderingsoversiktFeilet,
    } = state;

    const getVurderingsoversikt = () => {
        return get<Vurderingsoversikt>(endpoints.vurderingsoversiktKontinuerligTilsynOgPleie, httpErrorHandler, {
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
        onVurderingValgt(nyValgtVurderingselement.id);
        dispatch({ type: ActionType.VELG_VURDERINGSELEMENT, valgtVurderingselement: nyValgtVurderingselement });
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
            if (nesteSteg === tilsynOgPleieSteg) {
                oppdaterVurderingsoversikt();
            } else {
                navigerTilNesteSteg(nesteSteg);
            }
        });
    };

    const defaultPerioder =
        resterendeVurderingsperioderDefaultValue.length > 0
            ? resterendeVurderingsperioderDefaultValue
            : [new Period('', '')];

    const skalViseOpprettVurderingKnapp =
        !vurderingsoversikt?.harPerioderSomSkalVurderes() && !visRadForNyVurdering && harGyldigSignatur;

    return (
        <PageContainer isLoading={isLoading} hasError={vurderingsoversiktFeilet}>
            <VurderingsoversiktMessages
                vurderingsoversikt={vurderingsoversikt}
                harGyldigSignatur={harGyldigSignatur}
                vurderingstype={Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE}
            />
            {vurderingsoversikt?.harPerioderÅVise() && (
                <Box
                    marginTop={
                        vurderingsoversikt.harPerioderSomSkalVurderes() || !harGyldigSignatur ? Margin.medium : null
                    }
                >
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
                        detailSection={() => {
                            const harValgtVurderingselement = !!valgtVurderingselement?.id;
                            if (visVurderingDetails) {
                                const url = harValgtVurderingselement
                                    ? findHrefByRel(LinkRel.HENT_VURDERING, valgtVurderingselement.links)
                                    : '';
                                const opprettLink = findLinkByRel(LinkRel.OPPRETT_VURDERING, vurderingsoversikt.links);
                                return (
                                    <>
                                        {harValgtVurderingselement && (
                                            <VurderingsdetaljerController
                                                hentVurderingUrl={url}
                                                contentRenderer={(valgtVurdering) => (
                                                    <VurderingsoppsummeringForKontinuerligTilsynOgPleie
                                                        vurdering={valgtVurdering}
                                                    />
                                                )}
                                            />
                                        )}
                                        <div style={{ display: harValgtVurderingselement ? 'none' : '' }}>
                                            <NyVurderingController
                                                vurderingstype={Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE}
                                                opprettVurderingLink={opprettLink}
                                                dataTilVurderingUrl={endpoints.dataTilVurdering}
                                                onVurderingLagret={onVurderingLagret}
                                                formRenderer={(dokumenter, onSubmit) => (
                                                    <NyVurderingAvTilsynsbehovForm
                                                        defaultValues={{
                                                            [FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
                                                            [FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: undefined,
                                                            [FieldName.PERIODER]: defaultPerioder,
                                                            [FieldName.DOKUMENTER]: [],
                                                        }}
                                                        resterendeVurderingsperioder={
                                                            resterendeVurderingsperioderDefaultValue
                                                        }
                                                        perioderSomKanVurderes={
                                                            vurderingsoversikt.perioderSomKanVurderes
                                                        }
                                                        dokumenter={dokumenter}
                                                        onSubmit={onSubmit}
                                                        onAvbryt={visRadForNyVurdering ? onAvbryt : undefined}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </>
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

export default VilkårsvurderingAvTilsynOgPleie;
