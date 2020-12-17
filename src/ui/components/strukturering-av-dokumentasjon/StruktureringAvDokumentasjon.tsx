import React from 'react';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import Dokumentnavigasjon from '../dokumentnavigasjon/Dokumentnavigasjon';
import StrukturerDokumentForm from '../strukturer-dokument-form/StrukturerDokumentForm';
import StrukturertDokumentDetaljer from '../strukturert-dokument-detaljer/StrukturertDokumentDetaljer';

const StruktureringAvDokumentasjon = () => {
    const [valgtDokument, setValgtDokument] = React.useState(null);
    return (
        <NavigationWithDetailView
            navigationSection={() => (
                <Dokumentnavigasjon
                    dokumenter={['Legeerklæring 1', 'Legeerklæring 2', 'Legeerklæring 3']}
                    dokumenterSomMåGjennomgås={['Legeerklæring 4']}
                    onDokumentValgt={(legeerklæring) => setValgtDokument(legeerklæring)}
                />
            )}
            detailSection={() => {
                if (!valgtDokument) {
                    return <StrukturerDokumentForm dokumentNavn="Legeerklæring 4" />;
                }
                return <StrukturertDokumentDetaljer dokumentNavn={valgtDokument} />;
            }}
        />
    );
};

export default StruktureringAvDokumentasjon;
