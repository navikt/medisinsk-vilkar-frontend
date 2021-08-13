import express from 'express';
import cors from 'cors';
import mockedTilsynsbehovVurderingsoversikt from './mocked-data/mockedTilsynsbehovVurderingsoversikt';
import mockedToOmsorgspersonerVurderingsoversikt from './mocked-data/mockedToOmsorgspersonerVurderingsoversikt';
import mockedToOmsorgspersonerVurderinger from './mocked-data/mockedToOmsorgspersonerVurderinger';
import mockedTilsynsbehovVurderinger from './mocked-data/mockedTilsynsbehovVurderinger';
import mockedDokumentliste from './mocked-data/mockedDokumentliste';
import mockedDokumentoversikt from './mocked-data/mockedDokumentoversikt';
import { createKontinuerligTilsynVurdering, createToOmsorgspersonerVurdering } from './apiUtils';
import Vurderingstype from '../src/types/Vurderingstype';
import mockedDiagnosekoderesponse from './mocked-data/mockedDiagnosekodeResponse';
import mockedDiagnosekodeSearchResponse from './mocked-data/mockedDiagnosekodeSearchResponse';
import createStrukturertDokument from './mocked-data/createStrukturertDokument';
import mockedInnleggelsesperioder from './mocked-data/mockedInnleggelsesperioder';
import { Dokumenttype } from '../src/types/Dokument';
import createMockedVurderingselementLinks from './mocked-data/createMockedVurderingselementLinks';
import tilsynsbehovVurderingerMock from './mocked-data/mockedTilsynsbehovVurderinger';
import mockedNyeDokumenterList from './mocked-data/mockedNyeDokumenter';

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:8081',
    })
);

let mockedNyeDokumenter =[ ...mockedNyeDokumenterList];

app.use('/mock/status', (req, res) => {
    const harUklassifiserteDokumenter = mockedDokumentoversikt.dokumenter.some(
        ({ type }) => type === Dokumenttype.UKLASSIFISERT
    );
    const manglerDiagnosekode =
        !mockedDiagnosekoderesponse ||
        !mockedDiagnosekoderesponse.diagnosekoder ||
        mockedDiagnosekoderesponse.diagnosekoder.length === 0;
    const manglerGodkjentLegeerklæring =
        mockedDokumentoversikt.dokumenter.some(({ type }) => type === Dokumenttype.LEGEERKLÆRING) === false;
    const manglerVurderingAvKontinuerligTilsynOgPleie =
        mockedTilsynsbehovVurderingsoversikt.resterendeVurderingsperioder.length > 0;
    const manglerVurderingAvToOmsorgspersoner =
        mockedToOmsorgspersonerVurderingsoversikt.resterendeVurderingsperioder.length > 0;
    const nyttDokumentHarIkkekontrollertEksisterendeVurderinger = mockedNyeDokumenter.length > 0
    const harDataSomIkkeHarBlittTattMedIBehandling = true;

    res.send({
        kanLøseAksjonspunkt:
            !harUklassifiserteDokumenter &&
            !manglerDiagnosekode &&
            !manglerGodkjentLegeerklæring &&
            !manglerVurderingAvKontinuerligTilsynOgPleie &&
            !manglerVurderingAvToOmsorgspersoner &&
            !nyttDokumentHarIkkekontrollertEksisterendeVurderinger,
        harUklassifiserteDokumenter,
        manglerDiagnosekode,
        manglerGodkjentLegeerklæring,
        manglerVurderingAvKontinuerligTilsynOgPleie,
        manglerVurderingAvToOmsorgspersoner,
        harDataSomIkkeHarBlittTattMedIBehandling,
        nyttDokumentHarIkkekontrollertEksisterendeVurderinger
    });
});

app.use('/mock/vurdering', (req, res) => {
    const vurderingId = req.query.sykdomVurderingId;
    const alleVurderinger = [...mockedTilsynsbehovVurderinger, ...mockedToOmsorgspersonerVurderinger];
    const vurdering = alleVurderinger.find(({ id }) => id === vurderingId);
    res.send(vurdering);
});

app.use('/mock/opprett-vurdering', (req, res) => {
    if (req.body.dryRun === true) {
        res.send({
            perioderMedEndringer: [
                {
                    periode: {
                        fom: '2024-01-01',
                        tom: '2024-01-10',
                    },
                    endrerVurderingSammeBehandling: true,
                    endrerAnnenVurdering: false,
                },
            ],
        });
    } else {
        if (req.body.type === Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE) {
            createKontinuerligTilsynVurdering(req.body);
        } else {
            createToOmsorgspersonerVurdering(req.body);
        }
        res.send();
    }
});

app.use('/mock/endre-vurdering', (req, res) => {
    if (req.body.dryRun === true) {
        res.send({
            perioderMedEndringer: [
                {
                    periode: {
                        fom: '2024-01-01',
                        tom: '2024-01-10',
                    },
                    endrerVurderingSammeBehandling: true,
                    endrerAnnenVurdering: false,
                },
            ],
        });
    } else {
        const id = req.body.id;
        const perioder = req.body.perioder;
        mockedTilsynsbehovVurderingsoversikt.vurderingselementer = mockedTilsynsbehovVurderingsoversikt.vurderingselementer.filter(
            (element) => id !== element.id
        );
        perioder.forEach((periode) => {
            mockedTilsynsbehovVurderingsoversikt.vurderingselementer.unshift({
                id,
                periode: periode,
                resultat: req.body.resultat,
                gjelderForSøker: true,
                gjelderForAnnenPart: false,
                links: createMockedVurderingselementLinks(id),
                endretIDenneBehandlingen: true,
                erInnleggelsesperiode: false,
            });
        });

        const index = tilsynsbehovVurderingerMock.findIndex((element) => element.id === id);
        if (tilsynsbehovVurderingerMock[index]) {
            tilsynsbehovVurderingerMock[index].versjoner.unshift({
                perioder,
                resultat: req.body.resultat,
                dokumenter: mockedDokumentliste,
                tekst: req.body.tekst,
            });
        }
        res.send();
    }
});

app.use('/mock/kontinuerlig-tilsyn-og-pleie/vurderingsoversikt', (req, res) => {
    const harGyldigSignatur = mockedDokumentoversikt.dokumenter.some(({ type }) => type === Dokumenttype.LEGEERKLÆRING);
    res.send({
        ...mockedTilsynsbehovVurderingsoversikt,
        harGyldigSignatur,
        resterendeVurderingsperioder: !harGyldigSignatur
            ? []
            : mockedTilsynsbehovVurderingsoversikt.resterendeVurderingsperioder,
    });
});

app.use('/mock/to-omsorgspersoner/vurderingsoversikt', (req, res) => {
    const harGyldigSignatur = mockedDokumentoversikt.dokumenter.some(({ type }) => type === Dokumenttype.LEGEERKLÆRING);
    res.send({
        ...mockedToOmsorgspersonerVurderingsoversikt,
        harGyldigSignatur,
        resterendeVurderingsperioder: !harGyldigSignatur
            ? []
            : mockedToOmsorgspersonerVurderingsoversikt.resterendeVurderingsperioder,
    });
});

app.use('/mock/dokumentoversikt', (req, res) => {
    res.send(mockedDokumentoversikt);
});

app.use('/mock/endre-dokument', (req, res) => {
    createStrukturertDokument(req.body);
    res.send(mockedDokumentoversikt);
});

app.use('/mock/data-til-vurdering', (req, res) => {
    res.send(mockedDokumentliste);
});

app.use('/mock/diagnosekode-search', (req, res) => {
    res.send(mockedDiagnosekodeSearchResponse);
});

app.use('/mock/diagnosekoder', (req, res) => {
    res.send(mockedDiagnosekoderesponse);
});

app.use('/mock/endre-diagnosekoder', (req, res) => {
    mockedDiagnosekoderesponse.diagnosekoder = req.body.diagnosekoder || [];
    res.send({});
});

app.use('/mock/innleggelsesperioder', (req, res) => {
    res.send(mockedInnleggelsesperioder);
});

app.use('/mock/endre-innleggelsesperioder', (req, res) => {
    if (req.body.dryRun === true) {
        res.send({ førerTilRevurdering: true });
    } else {
        mockedInnleggelsesperioder.perioder = req.body.perioder || [];
        res.send({});
    }
});

app.get('/mock/nye-dokumenter', (req, res) => {
  res.send(mockedNyeDokumenter);
})

app.post('/mock/nye-dokumenter', (req, res) => {
  mockedNyeDokumenter = [];
  res.send({})
})

const port = 8082;
app.listen(port, (error) => {
    if (error) {
        console.error(error);
    }
    console.log('API-mock listening on port', port);
});
