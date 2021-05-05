import React from 'react';
import Vurderingselement from '../../../types/Vurderingselement';
import VurderingsoppsummeringForKontinuerligTilsynOgPleie from '../vurderingsoppsummering-for-kontinuerlig-tilsyn-og-pleie/VurderingsoppsummeringForKontinuerligTilsynOgPleie';
import VurderingsdetaljerFetcher from '../vurderingsdetaljer-fetcher/VurderingsdetaljerFetcher';
import LinkRel from '../../../constants/LinkRel';
import { findHrefByRel, findLinkByRel } from '../../../util/linkUtils';
import ManuellVurdering from '../../../types/ManuellVurdering';
import { buildInitialFormStateForEdit } from '../vilkårsvurdering-av-tilsyn-og-pleie/initialFormStateUtil';
import VurderingAvTilsynsbehovForm from '../vurdering-av-tilsynsbehov-form/VurderingAvTilsynsbehovForm';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import EndreVurderingController from '../endre-vurdering-controller/EndreVurderingController';
import ContainerContext from '../../context/ContainerContext';

interface VurderingsdetaljvisningForEksisterendeProps {
    vurderingsoversikt: Vurderingsoversikt;
    vurderingselement: Vurderingselement;
    editMode: boolean;
    onEditClick: () => void;
    onAvbrytClick: () => void;
    onVurderingLagret: () => void;
}

const VurderingsdetaljvisningForEksisterendeVurdering = ({
    vurderingsoversikt,
    vurderingselement,
    editMode,
    onEditClick,
    onAvbrytClick,
    onVurderingLagret,
}: VurderingsdetaljvisningForEksisterendeProps) => {
    const { endpoints } = React.useContext(ContainerContext);
    const manuellVurdering = vurderingselement as ManuellVurdering;
    const url = findHrefByRel(LinkRel.HENT_VURDERING, manuellVurdering.links);

    return (
        <VurderingsdetaljerFetcher
            url={url}
            contentRenderer={(vurdering) => {
                if (editMode) {
                    const endreLink = findLinkByRel(LinkRel.ENDRE_VURDERING, manuellVurdering.links);
                    const vurderingsversjon = vurdering.versjoner[0];
                    return (
                        <EndreVurderingController
                            endreVurderingLink={endreLink}
                            dataTilVurderingUrl={endpoints.dataTilVurdering}
                            formRenderer={(dokumenter, onSubmit) => (
                                <VurderingAvTilsynsbehovForm
                                    defaultValues={buildInitialFormStateForEdit(vurderingsversjon)}
                                    resterendeVurderingsperioder={vurderingsoversikt.resterendeVurderingsperioder}
                                    perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
                                    dokumenter={dokumenter}
                                    onSubmit={onSubmit}
                                    onAvbryt={onAvbrytClick}
                                />
                            )}
                            vurderingsid={vurderingselement.id}
                            vurderingsversjonId={vurderingsversjon.versjon}
                            onVurderingLagret={onVurderingLagret}
                        />
                    );
                }
                return (
                    <VurderingsoppsummeringForKontinuerligTilsynOgPleie
                        vurdering={vurdering}
                        redigerVurdering={onEditClick}
                    />
                );
            }}
        />
    );
};

export default VurderingsdetaljvisningForEksisterendeVurdering;
