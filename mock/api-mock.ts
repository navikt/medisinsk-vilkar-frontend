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

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:8081',
    })
);

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

app.use('/mock/kontinuerlig-tilsyn-og-pleie/vurderingsoversikt', (req, res) => {
    res.send({
        ...mockedTilsynsbehovVurderingsoversikt,
        harGyldigSignatur: mockedDokumentoversikt.dokumenter.some(({ type }) => type === Dokumenttype.LEGEERKLÆRING),
    });
});

app.use('/mock/to-omsorgspersoner/vurderingsoversikt', (req, res) => {
    res.send({
        ...mockedToOmsorgspersonerVurderingsoversikt,
        harGyldigSignatur: mockedDokumentoversikt.dokumenter.some(({ type }) => type === Dokumenttype.LEGEERKLÆRING),
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
    res.send({ diagnosekoder: mockedDiagnosekoderesponse });
});

app.use('/mock/legg-til-diagnosekode', (req, res) => {
    mockedDiagnosekoderesponse.push(req.body);
    res.send(mockedDiagnosekoderesponse);
});

app.use('/mock/slett-diagnosekode', (req, res) => {
    const index = mockedDiagnosekoderesponse.findIndex((el) => el.kode === req.query.kode);
    mockedDiagnosekoderesponse.splice(index, 1);
    res.send(mockedDiagnosekoderesponse);
});

app.use('/mock/innleggelsesperioder', (req, res) => {
    if (req.method === 'GET') {
        res.send({ perioder: mockedInnleggelsesperioder });
    } else if (req.method === 'POST') {
        mockedInnleggelsesperioder.splice(0, mockedInnleggelsesperioder.length, ...req.body);
        res.send({ perioder: mockedInnleggelsesperioder });
    }
});

const port = 8082;
app.listen(port, (error) => {
    if (error) {
        console.error(error);
    }
    console.log('API-mock listening on port', port);
});
