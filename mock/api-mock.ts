import express from 'express';
import cors from 'cors';
import mockedTilsynsbehovVurderingsoversikt from './mocked-data/mockedTilsynsbehovVurderingsoversikt';
import mockedToOmsorgspersonerVurderingsoversikt from './mocked-data/mockedToOmsorgspersonerVurderingsoversikt';
import mockedToOmsorgspersonerVurderinger from './mocked-data/mockedToOmsorgspersonerVurderinger';
import mockedTilsynsbehovVurderinger from './mocked-data/mockedTilsynsbehovVurderinger';
import mockedDokumentliste from './mocked-data/mockedDokumentliste';
import mockedDokumentoversikt from './mocked-data/mockedDokumentoversikt';
import { createVurdering } from './apiUtils';

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:8081',
    })
);

app.use('/mock/kontinuerlig-tilsyn-og-pleie/vurdering', (req, res) => {
    const vurderingId = req.query.vurderingId;
    const vurdering = mockedTilsynsbehovVurderinger.find(({ id }) => id === vurderingId);
    res.send(vurdering);
});

app.use('/mock/kontinuerlig-tilsyn-og-pleie/opprett-vurdering', (req, res) => {
    createVurdering(req.body);
    res.send();
});

app.use('/mock/to-omsorgspersoner/vurdering', (req, res) => {
    const vurderingId = req.query.vurderingId;
    const vurdering = mockedToOmsorgspersonerVurderinger.find(({ id }) => id === vurderingId);
    res.send(vurdering);
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

app.use('/mock/data-til-vurdering', (req, res) => {
    res.send(mockedDokumentliste);
});

const port = 8082;
app.listen(port, (error) => {
    if (error) {
        console.error(error);
    }
    console.log('API-mock listening on port', port);
});
