import React, { useMemo } from 'react';
import Spinner from 'nav-frontend-spinner';
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

const StruktureringAvDokumentasjon = () => {
    const { dokument, endpoints, onDokumentValgt } = React.useContext(ContainerContext);
    const fetchAborter = useMemo(() => new AbortController(), []);

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
        const { signal } = fetchAborter;
        return fetchData<Dokumentoversikt>(endpoints.dokumentoversikt, {
            signal,
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
            fetchAborter.abort();
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

    return (
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
                <DokumentasjonFooter harGyldigSignatur={harGyldigSignatur} />
            </Box>
        </>
    );
};

export default StruktureringAvDokumentasjon;
