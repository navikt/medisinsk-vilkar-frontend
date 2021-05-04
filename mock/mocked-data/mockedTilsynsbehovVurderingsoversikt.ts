import Vurderingsresultat from '../../src/types/Vurderingsresultat';
import mockedVurderingsoversiktLinks from './mockedVurderingsoversiktLinks';
import createMockedVurderingselementLinks from './createMockedVurderingselementLinks';
import Vurderingsoversikt from '../../src/types/Vurderingsoversikt';
import { Period } from '../../src/types/Period';

const tilsynsbehovVurderingsoversiktMock: Vurderingsoversikt = new Vurderingsoversikt({
    vurderingselementer: [
        {
            id: '1',
            periode: new Period('2022-02-01', '2022-02-15'),
            resultat: Vurderingsresultat.OPPFYLT,
            gjelderForSøker: false,
            gjelderForAnnenPart: true,
            links: createMockedVurderingselementLinks('1'),
            endretIDenneBehandlingen: false,
            erInnleggelsesperiode: false,
        },
        {
            id: '2',
            periode: new Period('2022-01-20', '2022-01-31'),
            resultat: Vurderingsresultat.OPPFYLT,
            gjelderForSøker: false,
            gjelderForAnnenPart: true,
            links: createMockedVurderingselementLinks('2'),
            endretIDenneBehandlingen: false,
            erInnleggelsesperiode: true,
        },
        {
            id: '3',
            periode: new Period('2022-01-15', '2020-01-19'),
            resultat: Vurderingsresultat.IKKE_OPPFYLT,
            gjelderForSøker: false,
            gjelderForAnnenPart: true,
            links: createMockedVurderingselementLinks('3'),
            endretIDenneBehandlingen: false,
            erInnleggelsesperiode: true,
        },
        {
            id: '4',
            periode: new Period('2022-01-01', '2020-01-14'),
            erInnleggelsesperiode: true,
        },
    ],
    resterendeVurderingsperioder: [new Period('2022-02-16', '2022-03-01')],
    perioderSomKanVurderes: [new Period('2022-01-15', '2022-03-01')],
    resterendeValgfrieVurderingsperioder: [],
    søknadsperioderTilBehandling: [],
    links: mockedVurderingsoversiktLinks,
    pleietrengendesFødselsdato: '2004-02-28',
    harPerioderDerPleietrengendeErOver18år: true,
});

export default tilsynsbehovVurderingsoversiktMock;
