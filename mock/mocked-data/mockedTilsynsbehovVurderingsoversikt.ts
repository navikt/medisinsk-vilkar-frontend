import Vurderingsresultat from '../../src/types/Vurderingsresultat';

const tilsynsbehovVurderingsoversiktMock = {
    vurderingselementer: [
        {
            id: '1',
            periode: { fom: '2020-01-01', tom: '2020-01-15' },
            resultat: Vurderingsresultat.OPPFYLT,
            gjelderForSøker: false,
            gjelderForAnnenPart: true,
            links: [
                {
                    href: 'http://localhost:8082/mock/kontinuerlig-tilsyn-og-pleie/vurdering/?vurderingId=1',
                    rel: 'sykdom-vurdering',
                    requestPayload: null,
                    type: 'GET',
                },
                {
                    href: 'http://localhost:8082/mock/kontinuerlig-tilsyn-og-pleie/vurdering/versjon',
                    rel: 'sykdom-vurdering-endring',
                    requestPayload: {
                        behandlingUuid: '71738d05-02d8-4476-833b-d5071146e5cc',
                        id: null,
                        versjon: null,
                        tekst: null,
                        resultat: null,
                        perioder: [],
                        tilknyttedeDokumenter: null,
                    },
                    type: 'POST',
                },
            ],
        },
    ],
    resterendeVurderingsperioder: [{ fom: '2020-01-16', tom: '2020-01-20' }],
    perioderSomKanVurderes: [
        { fom: '2020-01-01', tom: '2020-01-15' },
        { fom: '2020-01-16', tom: '2020-01-20' },
    ],
    søknadsperioderTilBehandling: [],
    links: [
        {
            href: 'http://localhost:8082/mock/kontinuerlig-tilsyn-og-pleie/opprett-vurdering',
            rel: 'sykdom-vurdering-opprettelse',
            requestPayload: {
                behandlingUuid: '71738d05-02d8-4476-833b-d5071146e5cc',
                type: null,
                tekst: null,
                resultat: null,
                perioder: [],
                tilknyttedeDokumenter: null,
            },
            type: 'POST',
        },
    ],
};

export default tilsynsbehovVurderingsoversiktMock;
