export default {
    opptjeninger: [
        {
            opptjeningsperiode: {
                fom: '2019-01-01',
                tom: '2019-04-01',
            },
            aktiviteter: [
                {
                    type: {
                        kode: 'ARBEID',
                        kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                    },
                    arbeidsgiverNavn: '1ELLERANNENBEDRIFT AS',
                    aktivitetsperiode: {
                        fom: '2019-01-01',
                        tom: '2019-04-01',
                    },
                    stillingsandel: 100,
                    erGodkjent: true,
                    erAvslått: false,
                    måVurderesAvSaksbehandler: false,
                },
                {
                    type: {
                        kode: 'ARBEID',
                        kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                    },
                    arbeidsgiverNavn: 'K0NGEB3DR1FT ASA',
                    aktivitetsperiode: {
                        fom: '2019-01-01',
                        tom: '2019-04-01',
                    },
                    stillingsandel: 100,
                    erGodkjent: false,
                    erAvslått: false,
                    måVurderesAvSaksbehandler: true,
                },
            ],
        },
    ],
};
