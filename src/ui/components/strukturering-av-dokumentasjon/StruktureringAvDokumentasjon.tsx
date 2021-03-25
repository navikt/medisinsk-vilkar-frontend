import React, { useMemo } from 'react';
import axios from 'axios';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import Dokumentnavigasjon from '../dokumentnavigasjon/Dokumentnavigasjon';
import StrukturertDokumentDetaljer from '../strukturert-dokument-detaljer/StrukturertDokumentDetaljer';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import ContainerContext from '../../context/ContainerContext';
import { get } from '../../../util/httpUtils';
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
import { finnNesteSteg } from '../../../util/statusUtils';
import Step, { dokumentSteg, StepId } from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import PageContainer from '../page-container/PageContainer';
import { Dokumentoversikt } from '../../../types/Dokumentoversikt';
import { DokumentoversiktResponse } from '../../../types/DokumentoversiktResponse';
import DokumentoversiktMessages from '../dokumentoversikt-messages/DokmentoversiktMessages';

interface StruktureringAvDokumentasjonProps {
    navigerTilNesteSteg: (steg: Step) => void;
    hentSykdomsstegStatus: () => Promise<SykdomsstegStatusResponse>;
    harRegistrertDiagnosekode: boolean;
}

const StruktureringAvDokumentasjon = ({
    navigerTilNesteSteg,
    hentSykdomsstegStatus,
    harRegistrertDiagnosekode,
}: StruktureringAvDokumentasjonProps) => {
    const { endpoints, httpErrorHandler, onFinished } = React.useContext(ContainerContext);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    const [state, dispatch] = React.useReducer(dokumentReducer, {
        visDokumentDetails: false,
        isLoading: true,
        dokumentoversikt: null,
        valgtDokument: null,
        dokumentoversiktFeilet: false,
        visRedigeringAvDokument: false,
        kanLøseAksjonspunkt: false,
        kanNavigereVidere: false,
        nesteSteg: null,
    });

    const {
        dokumentoversikt,
        isLoading,
        visDokumentDetails,
        valgtDokument,
        dokumentoversiktFeilet,
        visRedigeringAvDokument,
        kanLøseAksjonspunkt,
        kanNavigereVidere,
    } = state;

    const getDokumentoversikt = () => {
        return get<DokumentoversiktResponse>(endpoints.dokumentoversikt, httpErrorHandler, {
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
        hentSykdomsstegStatus().then((status) => {
            if (status.kanLøseAksjonspunkt) {
                dispatch({ type: ActionType.KAN_LØSE_AKSJONSPUNKT });
                return;
            }

            const nesteSteg = finnNesteSteg(status);
            if (nesteSteg === dokumentSteg) {
                getDokumentoversikt().then(({ dokumenter }: DokumentoversiktResponse) => {
                    const nyDokumentoversikt = new Dokumentoversikt(dokumenter);
                    visDokumentoversikt(nyDokumentoversikt);
                });
            } else {
                dispatch({ type: ActionType.KAN_NAVIGERE_VIDERE, nesteSteg });
            }
        });
    };

    return (
        <PageContainer isLoading={isLoading} hasError={dokumentoversiktFeilet} key={StepId.Dokument}>
            <DokumentoversiktMessages
                dokumentoversikt={dokumentoversikt}
                harRegistrertDiagnosekode={harRegistrertDiagnosekode}
                kanLøseAksjonspunkt={kanLøseAksjonspunkt}
                kanNavigereVidere={kanNavigereVidere}
                navigerTilNesteSteg={() => navigerTilNesteSteg(state.nesteSteg)}
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
