/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { rest } from 'msw';
import mockedDiagnosekodeResponse from '../../mock/mocked-data/mockedDiagnosekodeResponse';
import mockedNyeDokumenter from '../../mock/mocked-data/mockedNyeDokumenter';
import mockedDokumentoversikt from '../../mock/mocked-data/mockedDokumentoversikt';
import mockedInnleggelsesperioder from '../../mock/mocked-data/mockedInnleggelsesperioder';

export const testHandlers = {
    diagnosekoder: rest.get('http://localhost:8082/mock/diagnosekoder', (req, res, ctx) =>
        res(ctx.status(200), ctx.json(mockedDiagnosekodeResponse))
    ),
    status: rest.get('http://localhost:8082/mock/status', (req, res, ctx) =>
        res(
            ctx.status(200),
            ctx.json({
                kanLøseAksjonspunkt: false,
                harUklassifiserteDokumenter: true,
                manglerDiagnosekode: false,
                manglerGodkjentLegeerklæring: true,
                manglerVurderingAvKontinuerligTilsynOgPleie: true,
                manglerVurderingAvToOmsorgspersoner: true,
                harDataSomIkkeHarBlittTattMedIBehandling: true,
                nyttDokumentHarIkkekontrollertEksisterendeVurderinger: true,
            })
        )
    ),
    nyeDokumenter: rest.get('http://localhost:8082/mock/nye-dokumenter', (req, res, ctx) =>
        res(ctx.status(200), ctx.json(mockedNyeDokumenter))
    ),
    dokumentoversikt: rest.get('http://localhost:8082/mock/dokumentoversikt', (req, res, ctx) =>
        res(ctx.status(200), ctx.json(mockedDokumentoversikt))
    ),
    innleggelsesperioder: rest.get('http://localhost:8082/mock/innleggelsesperioder', (req, res, ctx) =>
        res(ctx.status(200), ctx.json(mockedInnleggelsesperioder))
    ),
};
