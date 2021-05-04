import Vurderingsresultat from '../../src/types/Vurderingsresultat';
import mockedVurderingsoversiktLinks from './mockedVurderingsoversiktLinks';
import createMockedVurderingselementLinks from './createMockedVurderingselementLinks';
import Vurderingsoversikt from '../../src/types/Vurderingsoversikt';
import { Period } from '../../src/types/Period';

const mockedToOmsorgspersonerVurderingsoversikt: Vurderingsoversikt = new Vurderingsoversikt({
    vurderingselementer: [
        {
            id: '11',
            periode: new Period('2022-02-01', '2022-02-15'),
            resultat: Vurderingsresultat.OPPFYLT,
            gjelderForSøker: false,
            gjelderForAnnenPart: true,
            links: createMockedVurderingselementLinks('11'),
            endretIDenneBehandlingen: false,
            erInnleggelsesperiode: false,
        },
        {
            id: '22',
            periode: new Period('2022-01-20', '2022-01-31'),
            resultat: Vurderingsresultat.OPPFYLT,
            gjelderForSøker: false,
            gjelderForAnnenPart: true,
            links: createMockedVurderingselementLinks('22'),
            endretIDenneBehandlingen: false,
            erInnleggelsesperiode: true,
        },
        {
            id: '33',
            periode: new Period('2022-01-15', '2022-01-19'),
            resultat: Vurderingsresultat.IKKE_OPPFYLT,
            gjelderForSøker: false,
            gjelderForAnnenPart: true,
            links: createMockedVurderingselementLinks('33'),
            endretIDenneBehandlingen: false,
            erInnleggelsesperiode: true,
        },
        {
            id: '55',
            periode: new Period('2022-01-01', '2022-01-14'),
            erInnleggelsesperiode: true,
        },
    ],
    resterendeVurderingsperioder: [new Period('2022-02-16', '2022-03-01')],
    perioderSomKanVurderes: [new Period('2022-01-15', '2022-03-01')],
    resterendeValgfrieVurderingsperioder: [new Period('2022-01-15', '2022-03-01')],
    søknadsperioderTilBehandling: [],
    links: mockedVurderingsoversiktLinks,
    pleietrengendesFødselsdato: '2021-04-27',
    harPerioderDerPleietrengendeErOver18år: true,
});

export default mockedToOmsorgspersonerVurderingsoversikt;
