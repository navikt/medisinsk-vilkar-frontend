import React from 'react';
import SykdomFormState, { SykdomFormValue } from '../../../types/SykdomFormState';
import ListOfTilsynStatusPanel from '../status-panel-tilsyn-list/ListOfTilsynStatusPanel';
import { TilsynStatus } from '../status-panel-tilsyn/TilsynStatusPanel';
import { Systemtittel } from 'nav-frontend-typografi';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import { intersectPeriods } from '../../../util/dateUtils';

interface SummaryProps {
    values: SykdomFormState;
    sykdom: Sykdom;
}

const Summary = ({ values, sykdom }: SummaryProps) => {
    const innleggelsesperioder = values[SykdomFormValue.INNLEGGELSESPERIODER].map((period) => ({
        period,
        status: TilsynStatus.INNLAGT,
    }));

    const perioderMedBehovForToOmsorgspersoner = values[
        SykdomFormValue.PERIODER_MED_BEHOV_FOR_TO_OMSORGSPERSONER
    ].map((period) => ({
        period,
        status: TilsynStatus.BEHOV_FOR_TO,
    }));

    const perioderMedBehovForEnOmsorgsperson = values[
        SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE
    ]
        .map((period) => ({
            period,
            status: TilsynStatus.BEHOV_FOR_EN,
        }))
        .filter((tilsyn1) => {
            return !perioderMedBehovForToOmsorgspersoner.some((tilsyn2) => {
                return (
                    tilsyn2.period.fom == tilsyn1.period.fom &&
                    tilsyn2.period.tom == tilsyn1.period.tom
                );
            });
        });

    const alleInnvilgedePerioder = [
        ...values[SykdomFormValue.INNLEGGELSESPERIODER],
        ...values[SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE],
        ...values[SykdomFormValue.PERIODER_MED_BEHOV_FOR_TO_OMSORGSPERSONER],
    ];

    const avslåttePerioder = intersectPeriods(
        sykdom.periodeTilVurdering,
        alleInnvilgedePerioder
    ).map((period) => ({
        period,
        status: TilsynStatus.IKKE_BEHOV,
    }));

    return (
        <div style={{ padding: '50px 35px' }}>
            <Systemtittel>Vurdering av tilsyn og pleie</Systemtittel>
            <hr />
            <ListOfTilsynStatusPanel
                perioderMedTilsynsbehov={[
                    ...innleggelsesperioder,
                    ...perioderMedBehovForToOmsorgspersoner,
                    ...perioderMedBehovForEnOmsorgsperson,
                    ...avslåttePerioder,
                ]}
            />
        </div>
    );
};

export default Summary;
