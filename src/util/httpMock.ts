import mockedTilsynsbehovVurderingsoversikt from '../mock/mockedTilsynsbehovVurderingsoversikt';
import Vurderingsoversikt from '../types/Vurderingsoversikt';

export const hentTilsynsbehovVurderingsoversikt = (scenario): Promise<Vurderingsoversikt> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockedTilsynsbehovVurderingsoversikt[scenario]), 500));
};

export const doDryRun = (): Promise<string> => {
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve('Alt i orden');
        }, 500)
    );
};
