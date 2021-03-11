import { finnNesteSteg } from '../statusUtils';
import StatusResponse from '../../types/SykdomsstegStatusResponse';
import { StegId } from '../../types/Steg';

describe('statusUtils', () => {
    describe('finnNesteSteg', () => {
        describe('dokumentsteget', () => {
            it('harUklassifiserteDokumenter=true should give Steg.Dokument', () => {
                const nesteSteg = finnNesteSteg({ harUklassifiserteDokumenter: true } as StatusResponse);
                expect(nesteSteg.id).toBe(StegId.Dokument);
            });

            it('manglerDiagnosekode=true should give Steg.Dokument', () => {
                const nesteSteg = finnNesteSteg({ manglerDiagnosekode: true } as StatusResponse);
                expect(nesteSteg.id).toBe(StegId.Dokument);
            });

            it('manglerGodkjentLegeerklæring=true should give Steg.Dokument', () => {
                const nesteSteg = finnNesteSteg({ manglerGodkjentLegeerklæring: true } as StatusResponse);
                expect(nesteSteg.id).toBe(StegId.Dokument);
            });
        });

        describe('tilsynOgPleie-steget', () => {
            it('manglerVurderingAvKontinuerligTilsynOgPleie should give Steg.TilsynOgPleie', () => {
                const nesteSteg = finnNesteSteg({
                    manglerVurderingAvKontinuerligTilsynOgPleie: true,
                } as StatusResponse);
                expect(nesteSteg.id).toBe(StegId.TilsynOgPleie);
            });
        });

        describe('toOmsorgspersoner-steget', () => {
            it('manglerVurderingAvToOmsorgspersoner should give Steg.TilsynOgPleie', () => {
                const nesteSteg = finnNesteSteg({ manglerVurderingAvToOmsorgspersoner: true } as StatusResponse);
                expect(nesteSteg.id).toBe(StegId.ToOmsorgspersoner);
            });
        });
    });
});
