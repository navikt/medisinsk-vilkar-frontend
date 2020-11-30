import genereltTilsynsbehovVurderingerMock from '../mock/mockedTilsynsbehovVurderinger';
import toOmsorgspersonerVurderinger from '../mock/mockedToOmsorgspersonerVurderinger';
import Vurdering from '../types/Vurdering';

export const hentTilsynsbehovVurderinger = (): Promise<Vurdering[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(genereltTilsynsbehovVurderingerMock), 500));
};

export const hentToOmsorgspersonerVurderinger = (): Promise<Vurdering[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(toOmsorgspersonerVurderinger), 500));
};
