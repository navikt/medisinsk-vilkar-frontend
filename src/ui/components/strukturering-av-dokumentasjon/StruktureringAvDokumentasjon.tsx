import React, { useMemo } from 'react';
import Spinner from 'nav-frontend-spinner';
import axios from 'axios';
import { Hovedknapp } from 'nav-frontend-knapper';
import Alertstripe from 'nav-frontend-alertstriper';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import Dokumentnavigasjon from '../dokumentnavigasjon/Dokumentnavigasjon';
import StrukturertDokumentDetaljer from '../strukturert-dokument-detaljer/StrukturertDokumentDetaljer';
import Dokument, { Dokumentoversikt, Dokumenttype } from '../../../types/Dokument';
import ContainerContext from '../../context/ContainerContext';
import { fetchData } from '../../../util/httpUtils';
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

interface StruktureringAvDokumentasjonProps {
    onProgressButtonClick: () => void;
}

const StruktureringAvDokumentasjon = ({ onProgressButtonClick }: StruktureringAvDokumentasjonProps) => {
    const [harRegistrertDiagnosekode, setHarRegistrertDiagnosekode] = React.useState<boolean | undefined>();
    const { dokument, endpoints, onDokumentValgt } = React.useContext(ContainerContext);
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
        return fetchData<Dokumentoversikt>(endpoints.dokumentoversikt, {
            cancelToken: httpCanceler.token,
        });
    };

    const visDokumentoversikt = (nyDokumentoversikt: Dokumentoversikt) => {
        dispatch({ type: ActionType.VIS_DOKUMENTOVERSIKT, dokumentoversikt: nyDokumentoversikt });
    };

    const handleError = () => {
        dispatch({ type: ActionType.DOKUMENTOVERSIKT_FEILET });
    };

    React.useEffect(() => {
        let isMounted = true;
        getDokumentoversikt()
            .then((nyDokumentoversikt) => {
                if (isMounted) {
                    visDokumentoversikt(nyDokumentoversikt);
                }
            })
            .catch(handleError);
        return () => {
            isMounted = false;
            httpCanceler.cancel();
        };
    }, []);

    const velgDokument = (nyttValgtDokument: Dokument) => {
        onDokumentValgt(nyttValgtDokument.id);
        dispatch({ type: ActionType.VELG_DOKUMENT, valgtDokument: nyttValgtDokument });
    };

    const oppdaterDokumentoversikt = () => {
        dispatch({ type: ActionType.PENDING });
        getDokumentoversikt().then(visDokumentoversikt);
    };

    if (isLoading) {
        return <Spinner />;
    }
    if (dokumentoversiktFeilet) {
        return <PageError message="Noe gikk galt, vennligst prøv igjen senere" />;
    }

    const strukturerteDokumenter = dokumentoversikt.dokumenter.filter(({ behandlet }) => behandlet);
    const ustrukturerteDokumenter = dokumentoversikt.dokumenter.filter(({ behandlet }) => !behandlet);
    const harGyldigSignatur = strukturerteDokumenter.some(({ type }) => type === Dokumenttype.LEGEERKLÆRING);
    const kanGåVidere = harGyldigSignatur && harRegistrertDiagnosekode && ustrukturerteDokumenter.length === 0;

    return (
        <>
            {kanGåVidere && (
                <Box marginBottom={Margin.large}>
                    <Alertstripe type="suksess">
                        Alle dokumenter er ferdig håndtert
                        <Hovedknapp
                            htmlType="button"
                            mini
                            style={{ marginLeft: '2rem' }}
                            onClick={onProgressButtonClick}
                        >
                            Gå videre
                        </Hovedknapp>
                    </Alertstripe>
                </Box>
            )}
            {harRegistrertDiagnosekode === false && (
                <Box marginBottom={Margin.medium}>
                    <Alertstripe type="advarsel">
                        Diagnosekode mangler. Du må legge til en diagnosekode for å vurdere tilsyn og pleie.
                    </Alertstripe>
                </Box>
            )}
            {!harGyldigSignatur && (
                <>
                    <Box marginBottom={Margin.medium}>
                        <Alertstripe type="advarsel">
                            Opplysinger om dokumentasjonsom er signert av sykehuslege mangler. Knytt dokument med
                            godkjent signatur, eller sett saken på vent mens du innhenter mer dokumentasjon.
                        </Alertstripe>
                    </Box>
                    {ustrukturerteDokumenter.length === 0 && (
                        <Box marginBottom={Margin.large}>
                            <FristForDokumentasjonUtløptPanel onProceedClick={() => console.log('1')} />
                        </Box>
                    )}
                </>
            )}
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
                        if (valgtDokument.behandlet) {
                            return <StrukturertDokumentDetaljer dokument={valgtDokument} />;
                        }

                        const strukturerDokumentLink = findLinkByRel(LinkRel.ENDRE_DOKUMENT, valgtDokument.links);
                        return (
                            <StrukturerDokumentController
                                ustrukturertDokument={valgtDokument}
                                strukturerDokumentUrl={strukturerDokumentLink.href}
                                onDokumentStrukturert={oppdaterDokumentoversikt}
                            />
                        );
                    }
                    return null;
                }}
            />
            <Box marginTop={Margin.xLarge}>
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
    );
};

export default StruktureringAvDokumentasjon;
