import genereltTilsynsbehovVurderingerMock from '../mock/mockedTilsynsbehovVurderinger';
import toOmsorgspersonerVurderinger from '../mock/mockedToOmsorgspersonerVurderinger';
import Vurdering from '../types/Vurdering';

export const hentTilsynsbehovVurderinger = (): Promise<Vurdering[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(genereltTilsynsbehovVurderingerMock), 2 * 1000));
};

export const hentToOmsorgspersonerVurderinger = (): Promise<Vurdering[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(toOmsorgspersonerVurderinger), 2 * 1000));
};
