import genereltTilsynsbehovVurderingerMock from '../mock/mockedVurderinger';
import Vurdering from '../types/Vurdering';

export const getVurderinger = (): Promise<Vurdering[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(genereltTilsynsbehovVurderingerMock), 2 * 1000));
};
