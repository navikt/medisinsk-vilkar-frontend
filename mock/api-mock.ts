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
import mockedDiagnosekoderespons from './mocked-data/mockedDiagnosekoderespons';
import createStrukturertDokument from './mocked-data/createStrukturertDokument';
import mockedInnleggelsesperioder from './mocked-data/mockedInnleggelsesperioder';

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
    if (req.body.type === Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE) {
        createKontinuerligTilsynVurdering(req.body);
    } else {
        createToOmsorgspersonerVurdering(req.body);
    }
    res.send();
});

app.use('/mock/kontinuerlig-tilsyn-og-pleie/vurderingsoversikt', (req, res) => {
    res.send(mockedTilsynsbehovVurderingsoversikt);
});

app.use('/mock/to-omsorgspersoner/vurderingsoversikt', (req, res) => {
    res.send(mockedToOmsorgspersonerVurderingsoversikt);
});

app.use('/mock/dokumentoversikt', (req, res) => {
    res.send(mockedDokumentoversikt);
});

app.use('/mock/endre-dokument', (req, res) => {
    createStrukturertDokument(req.body);
    res.sendStatus(200);
});

app.use('/mock/data-til-vurdering', (req, res) => {
    res.send(mockedDokumentliste);
});

app.use('/k9/diagnosekoder', (req, res) => {
    res.send(mockedDiagnosekoderespons);
});

app.use('/mock/innleggelsesperioder', (req, res) => {
    res.send(mockedInnleggelsesperioder);
});

const port = 8082;
app.listen(port, (error) => {
    if (error) {
        console.error(error);
    }
    console.log('API-mock listening on port', port);
});
