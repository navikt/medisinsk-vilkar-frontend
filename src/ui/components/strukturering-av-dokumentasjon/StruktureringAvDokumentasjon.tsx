import React, { useMemo } from 'react';
import Spinner from 'nav-frontend-spinner';
import axios from 'axios';
import Alertstripe from 'nav-frontend-alertstriper';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import Dokumentnavigasjon from '../dokumentnavigasjon/Dokumentnavigasjon';
import StrukturertDokumentDetaljer from '../strukturert-dokument-detaljer/StrukturertDokumentDetaljer';
import Dokument, { Dokumentoversikt, Dokumenttype } from '../../../types/Dokument';
import ContainerContext from '../../context/ContainerContext';
import { get } from '../../../util/httpUtils';
import PageError from '../page-error/PageError';
import dokumentReducer from './reducer';
import ActionType from './actionTypes';
import { findLinkByRel } from '../../../util/linkUtils';
import LinkRel from '../../../constants/LinkRel';
import StrukturerDokumentController from '../strukturer-dokument-controller/StrukturerDokumentController';
import DokumentasjonFooter from '../dokumentasjon-footer/DokumentasjonFooter';
import Box, { Margin } from '../box/Box';
import Innleggelsesperiodeoversikt from '../innleggelsesperiodeoversikt/Innleggelsesperiodeoversikt';
import Diagnosekodeoversikt from '../diagnosekodeoversikt/Diagnosekodeoversikt';
import SignertSeksjon from '../signert-seksjon/SignertSeksjon';
import FristForDokumentasjonUtløptPanel from '../frist-for-dokumentasjon-utløpt-panel/FristForDokumentasjonUtløptPanel';
import { sorterDokumenter } from '../../../util/dokumentUtils';
import { finnNesteSteg } from '../../../util/statusUtils';
import Steg, { dokumentSteg } from '../../../types/Steg';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';

interface StruktureringAvDokumentasjonProps {
    navigerTilNesteSteg: (steg: Steg) => void;
    hentSykdomsstegStatus: () => Promise<SykdomsstegStatusResponse>;
}

const StruktureringAvDokumentasjon = ({
    navigerTilNesteSteg,
    hentSykdomsstegStatus,
}: StruktureringAvDokumentasjonProps) => {
    const [harRegistrertDiagnosekode, setHarRegistrertDiagnosekode] = React.useState<boolean | undefined>();
    const { dokument, endpoints, onDokumentValgt, httpErrorHandler, onFinished } = React.useContext(ContainerContext);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    const [state, dispatch] = React.useReducer(dokumentReducer, {
        visDokumentDetails: false,
        isLoading: true,
        dokumentoversikt: null,
        valgtDokument: null,
        dokument,
        dokumentoversiktFeilet: false,
    });

    const { dokumentoversikt, isLoading, visDokumentDetails, valgtDokument, dokumentoversiktFeilet } = state;

    const getDokumentoversikt = () => {
        return get<Dokumentoversikt>(endpoints.dokumentoversikt, httpErrorHandler, {
            cancelToken: httpCanceler.token,
        });
    };

    const visDokumentoversikt = (nyDokumentoversikt: Dokumentoversikt) => {
        dispatch({ type: ActionType.VIS_DOKUMENTOVERSIKT, dokumentoversikt: nyDokumentoversikt });
    };

    const handleError = () => {
        dispatch({ type: ActionType.DOKUMENTOVERSIKT_FEILET });
    };

    const velgDokument = (nyttValgtDokument: Dokument) => {
        onDokumentValgt(nyttValgtDokument.id);
        dispatch({ type: ActionType.VELG_DOKUMENT, valgtDokument: nyttValgtDokument });
    };

    const åpneDokumentSomMåBehandles = (nyDokumentoversikt: Dokumentoversikt) => {
        const ustrukturerteDokumenter = nyDokumentoversikt.dokumenter
            .filter(({ type }) => type === Dokumenttype.UKLASSIFISERT)
            .sort(sorterDokumenter);
        const førsteDokumentSomMåBehandles = ustrukturerteDokumenter?.length > 0 ? ustrukturerteDokumenter[0] : null;
        if (førsteDokumentSomMåBehandles) {
            velgDokument(førsteDokumentSomMåBehandles);
        }
    };

    React.useEffect(() => {
        let isMounted = true;
        getDokumentoversikt()
            .then((nyDokumentoversikt) => {
                if (isMounted) {
                    visDokumentoversikt(nyDokumentoversikt);
                    åpneDokumentSomMåBehandles(nyDokumentoversikt);
                }
            })
            .catch(handleError);
        return () => {
            isMounted = false;
            httpCanceler.cancel();
        };
    }, []);

    const onDokumentStrukturert = () => {
        dispatch({ type: ActionType.PENDING });
        hentSykdomsstegStatus().then((status) => {
            if (status.kanLøseAksjonspunkt) {
                onFinished();
            }

            const nesteSteg = finnNesteSteg(status);
            if (nesteSteg === dokumentSteg) {
                getDokumentoversikt().then(visDokumentoversikt);
            } else {
                navigerTilNesteSteg(nesteSteg);
            }
        });
    };

    if (isLoading) {
        return <Spinner />;
    }
    if (dokumentoversiktFeilet) {
        return <PageError message="Noe gikk galt, vennligst prøv igjen senere" />;
    }

    const strukturerteDokumenter = dokumentoversikt.dokumenter.filter(
        ({ type }) => type !== Dokumenttype.UKLASSIFISERT
    );
    const ustrukturerteDokumenter = dokumentoversikt.dokumenter
        .filter(({ type }) => type === Dokumenttype.UKLASSIFISERT)
        .sort(sorterDokumenter);
    const harDokumenter = strukturerteDokumenter.length > 0 || ustrukturerteDokumenter.length > 0;
    const harGyldigSignatur = strukturerteDokumenter.some(({ type }) => type === Dokumenttype.LEGEERKLÆRING);

    return (
        <>
            {harRegistrertDiagnosekode === false && (
                <Box marginBottom={Margin.medium}>
                    <Alertstripe type="advarsel">
                        Diagnosekode mangler. Du må legge til en diagnosekode for å vurdere tilsyn og pleie.
                    </Alertstripe>
                </Box>
            )}
            {!harGyldigSignatur && harDokumenter && (
                <>
                    <Box marginBottom={Margin.medium}>
                        <Alertstripe type="advarsel">
                            Dokumentasjon signert av sykehuslege/spesialisthelsetjenesten mangler. Håndter eventuelle
                            nye dokumenter, eller sett saken på vent mens du innhenter mer dokumentasjon.
                        </Alertstripe>
                    </Box>
                    {ustrukturerteDokumenter.length === 0 && (
                        <Box marginBottom={Margin.large}>
                            <FristForDokumentasjonUtløptPanel onProceedClick={() => console.log('1')} />
                        </Box>
                    )}
                </>
            )}
            {harDokumenter === false && <Alertstripe type="info">Ingen dokumenter å vise</Alertstripe>}
            {harDokumenter === true && (
                <>
                    <NavigationWithDetailView
                        navigationSection={() => (
                            <Dokumentnavigasjon
                                dokumenter={strukturerteDokumenter}
                                dokumenterSomMåGjennomgås={ustrukturerteDokumenter}
                                onDokumentValgt={velgDokument}
                            />
                        )}
                        detailSection={() => {
                            if (visDokumentDetails) {
                                if (valgtDokument.type === Dokumenttype.UKLASSIFISERT) {
                                    const strukturerDokumentLink = findLinkByRel(
                                        LinkRel.ENDRE_DOKUMENT,
                                        valgtDokument.links
                                    );
                                    return (
                                        <StrukturerDokumentController
                                            ustrukturertDokument={valgtDokument}
                                            strukturerDokumentLink={strukturerDokumentLink}
                                            onDokumentStrukturert={onDokumentStrukturert}
                                        />
                                    );
                                }
                                return <StrukturertDokumentDetaljer dokument={valgtDokument} />;
                            }
                            return null;
                        }}
                    />

                    <Box marginTop={Margin.xxLarge}>
                        <DokumentasjonFooter
                            firstSectionRenderer={() => <Innleggelsesperiodeoversikt />}
                            secondSectionRenderer={() => (
                                <Diagnosekodeoversikt
                                    onDiagnosekoderUpdated={(diagnosekoder) => {
                                        setHarRegistrertDiagnosekode(diagnosekoder && diagnosekoder.length > 0);
                                    }}
                                />
                            )}
                            thirdSectionRenderer={() => <SignertSeksjon harGyldigSignatur={harGyldigSignatur} />}
                        />
                    </Box>
                </>
            )}
        </>
    );
};

export default StruktureringAvDokumentasjon;
