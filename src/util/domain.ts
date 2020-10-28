import Tilsynsbehov from '../types/Tilsynsbehov';

export function harTilsynsbehov(tilsynsbehov: Tilsynsbehov) {
    return tilsynsbehov === Tilsynsbehov.DELER || tilsynsbehov === Tilsynsbehov.HELE;
}
