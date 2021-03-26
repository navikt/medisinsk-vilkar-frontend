import axios from 'axios';
import React, { useMemo } from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import { Dokumentoversikt } from '../../../types/Dokumentoversikt';
import { DokumentoversiktResponse } from '../../../types/DokumentoversiktResponse';
import { StepId, tilsynOgPleieSteg, toOmsorgspersonerSteg } from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import { get } from '../../../util/httpUtils';
import { findLinkByRel } from '../../../util/linkUtils';
import { finnNesteSteg } from '../../../util/statusUtils';
import ContainerContext from '../../context/ContainerContext';
import Box, { Margin } from '../box/Box';
import Diagnosekodeoversikt from '../diagnosekodeoversikt/Diagnosekodeoversikt';
import DokumentasjonFooter from '../dokumentasjon-footer/DokumentasjonFooter';
import Dokumentnavigasjon from '../dokumentnavigasjon/Dokumentnavigasjon';
import DokumentoversiktMessages from '../dokumentoversikt-messages/DokmentoversiktMessages';
import Innleggelsesperiodeoversikt from '../innleggelsesperiodeoversikt/Innleggelsesperiodeoversikt';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import PageContainer from '../page-container/PageContainer';
import SignertSeksjon from '../signert-seksjon/SignertSeksjon';
import StrukturerDokumentController from '../strukturer-dokument-controller/StrukturerDokumentController';
import StrukturertDokumentDetaljer from '../strukturert-dokument-detaljer/StrukturertDokumentDetaljer';
import ActionType from './actionTypes';
import dokumentReducer from './reducer';

interface StruktureringAvDokumentasjonProps {
    navigerTilNesteSteg: () => void;
    hentSykdomsstegStatus: () => Promise<SykdomsstegStatusResponse>;
    sykdomsstegStatus: SykdomsstegStatusResponse;
}

const StruktureringAvDokumentasjon = ({
    navigerTilNesteSteg,
    hentSykdomsstegStatus,
    sykdomsstegStatus,
}: StruktureringAvDokumentasjonProps) => {
    const { endpoints, httpErrorHandler } = React.useContext(ContainerContext);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    const [state, dispatch] = React.useReducer(dokumentReducer, {
        visDokumentDetails: false,
        isLoading: true,
        dokumentoversikt: null,
        valgtDokument: null,
        dokumentoversiktFeilet: false,
        visRedigeringAvDokument: false,
    });

    const {
        dokumentoversikt,
        isLoading,
        visDokumentDetails,
        valgtDokument,
        dokumentoversiktFeilet,
        visRedigeringAvDokument,
    } = state;

    const { manglerDiagnosekode, kanLøseAksjonspunkt } = sykdomsstegStatus;

    const getDokumentoversikt = () =>
        get<DokumentoversiktResponse>(endpoints.dokumentoversikt, httpErrorHandler, {
            cancelToken: httpCanceler.token,
        });

    const visDokumentoversikt = (nyDokumentoversikt: Dokumentoversikt) => {
        dispatch({ type: ActionType.VIS_DOKUMENTOVERSIKT, dokumentoversikt: nyDokumentoversikt });
    };

    const handleError = () => {
        dispatch({ type: ActionType.DOKUMENTOVERSIKT_FEILET });
    };

    const velgDokument = (nyttValgtDokument: Dokument) => {
        dispatch({ type: ActionType.VELG_DOKUMENT, valgtDokument: nyttValgtDokument });
    };

    const åpneDokumentSomMåBehandles = ({ ustrukturerteDokumenter }: Dokumentoversikt) => {
        const førsteDokumentSomMåBehandles = ustrukturerteDokumenter?.length > 0 ? ustrukturerteDokumenter[0] : null;
        if (førsteDokumentSomMåBehandles) {
            velgDokument(førsteDokumentSomMåBehandles);
        }
    };

    React.useEffect(() => {
        let isMounted = true;
        getDokumentoversikt()
            .then(({ dokumenter }: DokumentoversiktResponse) => {
                if (isMounted) {
                    const nyDokumentoversikt = new Dokumentoversikt(dokumenter);
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

    const sjekkStatus = () => {
        dispatch({ type: ActionType.PENDING });
        hentSykdomsstegStatus().then(() => {
            getDokumentoversikt().then(({ dokumenter }: DokumentoversiktResponse) => {
                const nyDokumentoversikt = new Dokumentoversikt(dokumenter);
                visDokumentoversikt(nyDokumentoversikt);
            });
        });
    };

    const nesteStegErVurdering = () => {
        const nesteSteg = finnNesteSteg(sykdomsstegStatus);
        return nesteSteg === tilsynOgPleieSteg || nesteSteg === toOmsorgspersonerSteg;
    };

    return (
        <PageContainer isLoading={isLoading} hasError={dokumentoversiktFeilet} key={StepId.Dokument}>
            <DokumentoversiktMessages
                dokumentoversikt={dokumentoversikt}
                harRegistrertDiagnosekode={!manglerDiagnosekode}
                kanLøseAksjonspunkt={kanLøseAksjonspunkt}
                kanNavigereVidere={nesteStegErVurdering()}
                navigerTilNesteSteg={navigerTilNesteSteg}
            />
            {dokumentoversikt?.harDokumenter() === true && (
                <>
                    <NavigationWithDetailView
                        navigationSection={() => (
                            <Dokumentnavigasjon
                                dokumenter={dokumentoversikt.strukturerteDokumenter}
                                dokumenterSomMåGjennomgås={dokumentoversikt.ustrukturerteDokumenter}
                                onDokumentValgt={velgDokument}
                            />
                        )}
                        showDetailSection={visDokumentDetails}
                        detailSection={() => {
                            if (valgtDokument.type === Dokumenttype.UKLASSIFISERT || visRedigeringAvDokument) {
                                const strukturerDokumentLink = findLinkByRel(
                                    LinkRel.ENDRE_DOKUMENT,
                                    valgtDokument.links
                                );
                                return (
                                    <StrukturerDokumentController
                                        dokument={valgtDokument}
                                        strukturerDokumentLink={strukturerDokumentLink}
                                        onDokumentStrukturert={sjekkStatus}
                                        editMode={visRedigeringAvDokument}
                                    />
                                );
                            }
                            return (
                                <StrukturertDokumentDetaljer
                                    dokument={valgtDokument}
                                    onEditDokumentClick={() => dispatch({ type: ActionType.REDIGER_DOKUMENT })}
                                />
                            );
                        }}
                    />

                    <Box marginTop={Margin.xxLarge}>
                        <DokumentasjonFooter
                            firstSectionRenderer={() => <Innleggelsesperiodeoversikt />}
                            secondSectionRenderer={() => <Diagnosekodeoversikt onDiagnosekoderUpdated={sjekkStatus} />}
                            thirdSectionRenderer={() => (
                                <SignertSeksjon harGyldigSignatur={dokumentoversikt.harGyldigSignatur()} />
                            )}
                        />
                    </Box>
                </>
            )}
        </PageContainer>
    );
};

export default StruktureringAvDokumentasjon;
