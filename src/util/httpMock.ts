import mockedTilsynsbehovVurderingsoversikt from '../mock/mockedTilsynsbehovVurderingsoversikt';
import mockedToOmsorgspersonerVurderingsoversikt from '../mock/mockedToOmsorgspersonerVurderingsoversikt';
import Vurderingsoversikt from '../types/Vurderingsoversikt';

export const hentTilsynsbehovVurderingsoversikt = (scenario): Promise<Vurderingsoversikt> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockedTilsynsbehovVurderingsoversikt[scenario]), 500));
};

export const hentToOmsorgspersonerVurderingsoversikt = (): Promise<Vurderingsoversikt> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockedToOmsorgspersonerVurderingsoversikt), 500));
};

export const doDryRun = (): Promise<string> => {
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve('Alt i orden');
        }, 500)
    );
};
