import React from 'react';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import Dokumentnavigasjon from '../dokumentnavigasjon/Dokumentnavigasjon';
import StrukturerDokumentForm from '../strukturer-dokument-form/StrukturerDokumentForm';
import StrukturertDokumentDetaljer from '../strukturert-dokument-detaljer/StrukturertDokumentDetaljer';
import { hentDokumentoversikt } from '../../../util/httpMock';
import Dokumentoversikt from '../../../types/Dokument';

const StruktureringAvDokumentasjon = () => {
    const [valgtDokument, setValgtDokument] = React.useState(null);
    const [dokumentoversikt, setDokumentoversikt] = React.useState<Dokumentoversikt>(null);

    React.useEffect(() => {
        let isMounted = true;
        hentDokumentoversikt().then((nyDokumentoversikt: Dokumentoversikt) => {
            if (isMounted) {
                setDokumentoversikt(nyDokumentoversikt);
            }
        });
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
                        return <StrukturerDokumentForm dokument={ustrukturertDokument} />;
                    }
                    return 'Ingen dokumenter å vise';
                }
                return <StrukturertDokumentDetaljer dokument={valgtDokument} />;
            }}
        />
    );
};

export default StruktureringAvDokumentasjon;
