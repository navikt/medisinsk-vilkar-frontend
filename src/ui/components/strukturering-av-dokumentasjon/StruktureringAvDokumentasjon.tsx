import React from 'react';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import Dokumentnavigasjon from '../dokumentnavigasjon/Dokumentnavigasjon';
import StrukturerDokumentForm from '../strukturer-dokument-form/StrukturerDokumentForm';
import StrukturertDokumentDetaljer from '../strukturert-dokument-detaljer/StrukturertDokumentDetaljer';
import { Dokumentoversikt, StrukturertDokument } from '../../../types/Dokument';
import ContainerContext from '../../context/ContainerContext';
import { fetchData } from '../../../util/httpUtils';
import PageError from '../page-error/PageError';

function lagreStrukturertDokument(dokument: StrukturertDokument) {
    return new Promise((resolve) => {
        setTimeout(() => resolve({}), 1000);
    });
}

const StruktureringAvDokumentasjon = () => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [valgtDokument, setValgtDokument] = React.useState(null);
    const [dokumentoversikt, setDokumentoversikt] = React.useState<Dokumentoversikt>(null);
    const [dokumentoversiktHarFeilet, setDokumentoversiktHarFeilet] = React.useState<boolean>(false);

    const { endpoints } = React.useContext(ContainerContext);
    const dokumentoversiktUrl = endpoints.dokumentoversikt;

    const handleError = () => {
        setIsLoading(false);
        setDokumentoversiktHarFeilet(true);
    };

    React.useEffect(() => {
        let isMounted = true;
        fetchData(dokumentoversiktUrl)
            .then((nyDokumentoversikt: Dokumentoversikt) => {
                if (isMounted) {
                    setDokumentoversikt(nyDokumentoversikt);
                    setIsLoading(false);
                }
            })
            .catch(handleError);
        return () => {
            isMounted = false;
        };
    }, []);

    const strukturerteDokumenter = React.useMemo(() => {
        if (dokumentoversikt) {
            const { dokumenterMedMedisinskeOpplysninger, dokumenterUtenMedisinskeOpplysninger } = dokumentoversikt;
            return [...dokumenterMedMedisinskeOpplysninger, ...dokumenterUtenMedisinskeOpplysninger];
        }
        return [];
    }, [dokumentoversikt]);

    const lagreStruktureringAvDokument = (dokument: StrukturertDokument) => {
        setIsLoading(true);
        lagreStrukturertDokument(dokument).then(
            () => {
                setIsLoading(false);
            },
            () => {
                // showErrorMessage ??
                setIsLoading(false);
            }
        );
    };

    if (isLoading) {
        return <p>Henter dokumenter</p>;
    }
    if (dokumentoversiktHarFeilet) {
        return <PageError message="Noe gikk galt, vennligst prøv igjen senere." />;
    }
    return (
        <NavigationWithDetailView
            navigationSection={() => (
                <Dokumentnavigasjon
                    dokumenter={strukturerteDokumenter}
                    dokumenterSomMåGjennomgås={dokumentoversikt?.ustrukturerteDokumenter}
                    onDokumentValgt={(legeerklæring) => setValgtDokument(legeerklæring)}
                />
            )}
            detailSection={() => {
                if (!valgtDokument) {
                    const ustrukturertDokument = dokumentoversikt?.ustrukturerteDokumenter[0];
                    if (ustrukturertDokument) {
                        return (
                            <StrukturerDokumentForm
                                dokument={ustrukturertDokument}
                                onSubmit={lagreStruktureringAvDokument}
                            />
                        );
                    }
                    return 'Ingen dokumenter å vise';
                }
                return <StrukturertDokumentDetaljer dokument={valgtDokument} />;
            }}
        />
    );
};

export default StruktureringAvDokumentasjon;
