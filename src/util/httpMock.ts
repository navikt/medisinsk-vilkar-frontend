import mockedTilsynsbehovVurderingsoversikt from '../mock/mockedTilsynsbehovVurderingsoversikt';
import mockedToOmsorgspersonerVurderingsoversikt from '../mock/mockedToOmsorgspersonerVurderingsoversikt';
import Vurderingsoversikt from '../types/Vurderingsoversikt';

export const hentTilsynsbehovVurderingsoversikt = (): Promise<Vurderingsoversikt> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockedTilsynsbehovVurderingsoversikt), 500));
};

export const hentToOmsorgspersonerVurderingsoversikt = (): Promise<Vurderingsoversikt> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockedToOmsorgspersonerVurderingsoversikt), 500));
};
