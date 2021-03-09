import React, { useMemo } from 'react';
import axios from 'axios';
import Alertstripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import { Period } from '../../../types/Period';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import ContainerContext from '../../context/ContainerContext';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import Vurderingsnavigasjon from '../vurderingsnavigasjon/Vurderingsnavigasjon';
import ActionType from './actionTypes';
import vilkårsvurderingReducer from './reducer';
import processVurderingsoversikt, {
    finnVurderingsperioderSomOverlapperMedNyeSøknadsperioder,
} from '../../../util/vurderingsoversiktUtils';
import { get } from '../../../util/httpUtils';
import LinkRel from '../../../constants/LinkRel';
import { findHrefByRel, findLinkByRel } from '../../../util/linkUtils';
import NyVurderingController from '../ny-vurdering-controller/NyVurderingController';
import VurderingsdetaljerController from '../vurderingsdetaljer-controller/VurderingsdetaljerController';
import VurderingsoppsummeringForKontinuerligTilsynOgPleie from '../vurderingsoppsummering-for-kontinuerlig-tilsyn-og-pleie/VurderingsoppsummeringForKontinuerligTilsynOgPleie';
import Box, { Margin } from '../box/Box';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import NyVurderingAvTilsynsbehovForm, {
    FieldName,
} from '../ny-vurdering-av-tilsynsbehov-form/NyVurderingAvTilsynsbehovForm';
import Vurderingstype from '../../../types/Vurderingstype';
import { getStringMedPerioder } from '../../../util/periodUtils';
import PageContainer from '../page-container/PageContainer';

interface VilkårsvurderingAvTilsynOgPleieProps {
    onVilkårVurdert: () => void;
}

const VilkårsvurderingAvTilsynOgPleie = ({ onVilkårVurdert }: VilkårsvurderingAvTilsynOgPleieProps): JSX.Element => {
    const { vurdering, onVurderingValgt, endpoints, httpErrorHandler } = React.useContext(ContainerContext);
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

    const harPerioderSomSkalVurderes =
        vurderingsoversikt &&
        vurderingsoversikt.resterendeVurderingsperioder &&
        vurderingsoversikt.resterendeVurderingsperioder.length > 0;

    const harVurdertePerioder =
        vurderingsoversikt &&
        vurderingsoversikt.vurderingselementer &&
        vurderingsoversikt.vurderingselementer.length > 0;

    const harGyldigSignatur = vurderingsoversikt && vurderingsoversikt.harGyldigSignatur === true;

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

    const åpneFørstePeriodeSomMåBehandles = (nyVurderingsoversikt: Vurderingsoversikt) => {
        const harEnPeriodeSomMåBehandles = nyVurderingsoversikt?.resterendeVurderingsperioder?.length > 0;

        if (harEnPeriodeSomMåBehandles) {
            visNyVurderingForm(nyVurderingsoversikt.resterendeVurderingsperioder);
        }
    };

    React.useEffect(() => {
        let isMounted = true;
        getVurderingsoversikt()
            .then(processVurderingsoversikt)
            .then((nyVurderingsoversikt) => {
                if (isMounted) {
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
        getVurderingsoversikt().then(processVurderingsoversikt).then(visVurderingsoversikt);
    };

    const defaultPerioder =
        resterendeVurderingsperioderDefaultValue.length > 0
            ? resterendeVurderingsperioderDefaultValue
            : [new Period('', '')];

    if (!harGyldigSignatur) {
        return (
            <Alertstripe type="info">
                Du kan ikke vurdere tilsyn og pleie før søker har sendt inn legeerklæring fra
                sykehus/spesialisthelsetjenesten.
            </Alertstripe>
        );
    }

    return (
        <PageContainer isLoading={isLoading} hasError={vurderingsoversiktFeilet}>
            {!harPerioderSomSkalVurderes && (
                <Box marginBottom={Margin.large}>
                    {!harVurdertePerioder && (
                        <Box marginBottom={Margin.medium}>
                            <Alertstripe type="info">Ingen perioder å vurdere</Alertstripe>
                        </Box>
                    )}
                    <Alertstripe type="suksess">
                        Behov for kontinuerlig tilsyn og pleie er ferdig vurdert
                        <WriteAccessBoundContent
                            contentRenderer={() => (
                                <Knapp
                                    type="hoved"
                                    htmlType="button"
                                    style={{ marginLeft: '2rem', marginBottom: '-0.25rem' }}
                                    onClick={onVilkårVurdert}
                                    mini
                                    id="fortsettKnapp"
                                >
                                    Fortsett
                                </Knapp>
                            )}
                        />
                    </Alertstripe>
                </Box>
            )}
            {harPerioderSomSkalVurderes && (
                <div>
                    <Alertstripe type="advarsel">
                        {`Vurder behov for tilsyn og pleie for ${getStringMedPerioder(
                            vurderingsoversikt.resterendeVurderingsperioder
                        )}.`}
                    </Alertstripe>
                    {/*
                        Please note:
                        So long as this doesnt actually do anything upon the click-event, it should be commented out.

                        overlappendeVurderingsperioder && overlappendeVurderingsperioder.length > 0 && (
                        <Box marginTop={Margin.medium}>
                            <OverlappendeSøknadsperiodePanel
                                onProgressButtonClick={() => console.log('does something')}
                                overlappendeVurderingsperioder={overlappendeVurderingsperioder}
                            />
                        </Box>)
                    */}
                    <div style={{ marginTop: '1rem' }} />
                </div>
            )}
            <NavigationWithDetailView
                navigationSection={() => (
                    <Vurderingsnavigasjon
                        vurderingselementer={vurderingsoversikt?.vurderingselementer}
                        resterendeVurderingsperioder={vurderingsoversikt?.resterendeVurderingsperioder}
                        onVurderingValgt={velgVurderingselement}
                        onNyVurderingClick={visNyVurderingForm}
                        visRadForNyVurdering={visRadForNyVurdering}
                        visParterLabel
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
                                        onVurderingLagret={oppdaterVurderingsoversikt}
                                        formRenderer={(dokumenter, onSubmit) => (
                                            <NyVurderingAvTilsynsbehovForm
                                                defaultValues={{
                                                    [FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
                                                    [FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: undefined,
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
                                </div>
                            </>
                        );
                    }
                    return null;
                }}
            />
        </PageContainer>
    );
};

export default VilkårsvurderingAvTilsynOgPleie;
