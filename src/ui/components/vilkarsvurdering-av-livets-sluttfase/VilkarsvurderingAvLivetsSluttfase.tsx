import { get } from '@navikt/k9-http-utils';
import { Period } from '@navikt/k9-period-utils';
import { NavigationWithDetailView, PageContainer, Box, Margin } from '@navikt/k9-react-components';
import React, { useMemo } from 'react';
import axios from 'axios';
import Step, { livetsSluttfaseSteg, StepId } from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { finnNesteStegForLivetsSluttfase } from '../../../util/statusUtils';
import ContainerContext from '../../context/ContainerContext';
import Vurderingsnavigasjon from '../vurderingsnavigasjon/Vurderingsnavigasjon';
import ActionType from './actionTypes';
import vilkårsvurderingReducer from './reducer';
import Vurderingsdetaljer from '../vurderingsdetaljer/Vurderingsdetaljer';
import VurderingsoversiktSluttfaseMessages
    from '../vurderingsoversikt-sluttfase-messages/VurderingsoversiktSluttfaseMessages';

interface VilkårsvurderingAvLivetsSluttfaseProps {
    navigerTilNesteSteg: (steg: Step, ikkeMarkerSteg?: boolean) => void;
    hentSykdomsstegStatus: () => Promise<SykdomsstegStatusResponse>;
    sykdomsstegStatus: SykdomsstegStatusResponse;
}

const VilkårsvurderingAvLivetsSluttfase = ({
    navigerTilNesteSteg,
    hentSykdomsstegStatus,
    sykdomsstegStatus,
}: VilkårsvurderingAvLivetsSluttfaseProps): JSX.Element => {
    const { endpoints, httpErrorHandler } = React.useContext(ContainerContext);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    const [state, dispatch] = React.useReducer(vilkårsvurderingReducer, {
        visVurderingDetails: false,
        isLoading: true,
        vurderingsoversikt: null,
        valgtVurderingselement: null,
        skalViseRadForNyVurdering: false,
        vurderingsoversiktFeilet: false,
    });

    const {
        vurderingsoversikt,
        isLoading,
        visVurderingDetails,
        valgtVurderingselement,
        skalViseRadForNyVurdering,
        vurderingsoversiktFeilet,
    } = state;

    const { manglerGodkjentLegeerklæring } = sykdomsstegStatus;
    const harGyldigSignatur = !manglerGodkjentLegeerklæring;

    const getVurderingsoversikt = () =>
        get<Vurderingsoversikt>(endpoints.vurderingsoversiktLivetsSluttfase, httpErrorHandler, {
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

    const onAvbryt = () => {
        dispatch({
            type: ActionType.AVBRYT_FORM,
        });
    };

    const onVurderingLagret = () => {
        dispatch({ type: ActionType.PENDING });
        hentSykdomsstegStatus().then((status) => {
            const nesteSteg = finnNesteStegForLivetsSluttfase(status);
            if (nesteSteg === livetsSluttfaseSteg || nesteSteg === null) {
                oppdaterVurderingsoversikt();
            } else if (nesteSteg !== null) {
                navigerTilNesteSteg(nesteSteg);
            }
        }).catch(handleError);
    };

    const setMargin = () => {
        if (vurderingsoversikt.harPerioderSomSkalVurderes() || !harGyldigSignatur) {
            return Margin.medium;
        }
        return null;
    };

    const skalViseOpprettVurderingKnapp =
        !vurderingsoversikt?.harPerioderSomSkalVurderes() && !skalViseRadForNyVurdering && harGyldigSignatur;

    const skalViseNyVurderingForm = visVurderingDetails && !valgtVurderingselement;

    return (
        <PageContainer isLoading={isLoading} hasError={vurderingsoversiktFeilet} key={StepId.LivetsSluttfase}>
            <VurderingsoversiktSluttfaseMessages vurderingsoversikt={vurderingsoversikt} harGyldigSignatur={harGyldigSignatur} />
            {vurderingsoversikt?.harPerioderÅVise() && (
                <Box marginTop={setMargin()}>
                    <NavigationWithDetailView
                        navigationSection={() => (
                            <Vurderingsnavigasjon
                                vurderingselementer={vurderingsoversikt?.vurderingselementer}
                                resterendeVurderingsperioder={vurderingsoversikt?.resterendeVurderingsperioder}
                                onVurderingValgt={velgVurderingselement}
                                onNyVurderingClick={visNyVurderingForm}
                                visRadForNyVurdering={skalViseRadForNyVurdering}
                                visParterLabel
                                visOpprettVurderingKnapp={skalViseOpprettVurderingKnapp}
                            />
                        )}
                        showDetailSection={visVurderingDetails}
                        detailSection={() => (
                            <Vurderingsdetaljer
                                vurderingsoversikt={vurderingsoversikt}
                                valgtVurderingselement={valgtVurderingselement}
                                radForNyVurderingVises={skalViseRadForNyVurdering}
                                nyVurderingFormVises={skalViseNyVurderingForm}
                                onVurderingLagret={onVurderingLagret}
                                onAvbryt={onAvbryt}
                            />
                        )}
                    />
                </Box>
            )}
        </PageContainer>
    );
};

export default VilkårsvurderingAvLivetsSluttfase;