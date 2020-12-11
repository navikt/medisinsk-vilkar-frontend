import mockedTilsynsbehovVurderingsoversikt from '../mock/mockedTilsynsbehovVurderingsoversikt';
import Vurderingsoversikt from '../types/Vurderingsoversikt';

export const hentTilsynsbehovVurderingsoversikt = (): Promise<Vurderingsoversikt> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockedTilsynsbehovVurderingsoversikt), 500));
};

export const doDryRun = (): Promise<string> => {
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve('Alt i orden');
        }, 500)
    );
};
