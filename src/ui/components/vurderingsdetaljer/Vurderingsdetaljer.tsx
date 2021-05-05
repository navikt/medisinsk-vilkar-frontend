import React from 'react';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import VurderingsdetaljerFetcher from '../vurderingsdetaljer-fetcher/VurderingsdetaljerFetcher';
import LinkRel from '../../../constants/LinkRel';
import { findHrefByRel, findLinkByRel } from '../../../util/linkUtils';
import ManuellVurdering from '../../../types/ManuellVurdering';
import EndreVurdering from '../endre-vurdering/EndreVurdering';
import VurderingsoppsummeringForKontinuerligTilsynOgPleie from '../vurderingsoppsummering-for-kontinuerlig-tilsyn-og-pleie/VurderingsoppsummeringForKontinuerligTilsynOgPleie';
import NyVurderingController from '../ny-vurdering-controller/NyVurderingController';
import Vurderingstype from '../../../types/Vurderingstype';
import VurderingAvTilsynsbehovForm, { FieldName } from '../vurdering-av-tilsynsbehov-form/VurderingAvTilsynsbehovForm';
import { buildInitialFormStateForEdit } from '../vilkårsvurdering-av-tilsyn-og-pleie/initialFormStateUtil';
import { Period } from '../../../types/Period';
import ContainerContext from '../../context/ContainerContext';

interface VurderingsdetaljerProps {
    valgtVurderingselement: Vurderingselement;
    vurderingsoversikt: Vurderingsoversikt;
    onVurderingLagret: () => void;
    onAvbryt: () => void;
    visRadForNyVurdering: boolean;
    visNyVurderingForm: boolean;
}

const Vurderingsdetaljer = ({
    valgtVurderingselement,
    vurderingsoversikt,
    onVurderingLagret,
    onAvbryt,
    visRadForNyVurdering,
    visNyVurderingForm,
}: VurderingsdetaljerProps) => {
    const [editMode, setEditMode] = React.useState(false);

    React.useEffect(() => {
        setEditMode(false);
    }, [valgtVurderingselement]);

    const endreVurderingFormRenderer = (dokumenter, onSubmit, vurderingsversjon) => (
        <VurderingAvTilsynsbehovForm
            defaultValues={buildInitialFormStateForEdit(vurderingsversjon)}
            resterendeVurderingsperioder={vurderingsoversikt.resterendeVurderingsperioder}
            perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
            dokumenter={dokumenter}
            onSubmit={onSubmit}
            onAvbryt={() => setEditMode(false)}
        />
    );

    const harValgtVurderingselement = !!valgtVurderingselement;
    let valgtVurderingContent = null;
    if (valgtVurderingselement) {
        const manuellVurdering = valgtVurderingselement as ManuellVurdering;
        const url = findHrefByRel(LinkRel.HENT_VURDERING, manuellVurdering.links);
        valgtVurderingContent = (
            <VurderingsdetaljerFetcher
                url={url}
                contentRenderer={(vurdering) => {
                    if (editMode) {
                        const vurderingsversjon = vurdering.versjoner[0];
                        return (
                            <EndreVurdering
                                vurderingselement={manuellVurdering}
                                vurderingsversjon={vurderingsversjon}
                                onVurderingLagret={onVurderingLagret}
                                formRenderer={(dokumenter, onSubmit) =>
                                    endreVurderingFormRenderer(dokumenter, onSubmit, vurderingsversjon)
                                }
                            />
                        );
                    }
                    return (
                        <VurderingsoppsummeringForKontinuerligTilsynOgPleie
                            vurdering={vurdering}
                            redigerVurdering={() => setEditMode(true)}
                        />
                    );
                }}
            />
        );
    }
    const opprettLink = findLinkByRel(LinkRel.OPPRETT_VURDERING, vurderingsoversikt.links);
    const resterendeVurderingsperioderDefaultValue = vurderingsoversikt.resterendeVurderingsperioder;
    const defaultPerioder =
        resterendeVurderingsperioderDefaultValue.length > 0
            ? resterendeVurderingsperioderDefaultValue
            : [new Period('', '')];

    const { endpoints } = React.useContext(ContainerContext);

    return (
        <>
            {harValgtVurderingselement && valgtVurderingContent}
            <div style={{ display: harValgtVurderingselement || !visNyVurderingForm ? 'none' : '' }}>
                <NyVurderingController
                    vurderingstype={Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE}
                    opprettVurderingLink={opprettLink}
                    dataTilVurderingUrl={endpoints.dataTilVurdering}
                    onVurderingLagret={onVurderingLagret}
                    formRenderer={(dokumenter, onSubmit) => (
                        <VurderingAvTilsynsbehovForm
                            defaultValues={{
                                [FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
                                [FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: undefined,
                                [FieldName.PERIODER]: defaultPerioder,
                                [FieldName.DOKUMENTER]: [],
                            }}
                            resterendeVurderingsperioder={resterendeVurderingsperioderDefaultValue}
                            perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
                            dokumenter={dokumenter}
                            onSubmit={onSubmit}
                            onAvbryt={visRadForNyVurdering ? () => onAvbryt() : undefined}
                        />
                    )}
                />
            </div>
        </>
    );
};

export default Vurderingsdetaljer;
