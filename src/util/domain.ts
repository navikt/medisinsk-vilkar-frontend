import Tilsynsbehov from '../types/Tilsynsbehov';

export function erHeltEllerDelvisOppfylt(tilsynsbehov: Tilsynsbehov) {
    return tilsynsbehov === Tilsynsbehov.DELER || tilsynsbehov === Tilsynsbehov.HELE;
}
