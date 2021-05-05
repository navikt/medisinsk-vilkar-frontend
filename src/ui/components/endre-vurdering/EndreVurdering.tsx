import React from 'react';
import { Vurderingsversjon } from '../../../types/Vurdering';
import EndreVurderingController from '../endre-vurdering-controller/EndreVurderingController';
import { findLinkByRel } from '../../../util/linkUtils';
import LinkRel from '../../../constants/LinkRel';
import ManuellVurdering from '../../../types/ManuellVurdering';
import ContainerContext from '../../context/ContainerContext';
import Dokument from '../../../types/Dokument';

interface EditVurderingProps {
    vurderingselement: ManuellVurdering;
    vurderingsversjon: Vurderingsversjon;
    formRenderer: (dokumenter: Dokument[], onSubmit: (vurderingsversjon: Vurderingsversjon) => void) => React.ReactNode;
    onVurderingLagret: () => void;
}

const EndreVurdering = ({
    vurderingselement,
    vurderingsversjon,
    formRenderer,
    onVurderingLagret,
}: EditVurderingProps) => {
    const { endpoints } = React.useContext(ContainerContext);
    const endreLink = findLinkByRel(LinkRel.ENDRE_VURDERING, vurderingselement.links);
    return (
        <EndreVurderingController
            endreVurderingLink={endreLink}
            dataTilVurderingUrl={endpoints.dataTilVurdering}
            formRenderer={formRenderer}
            vurderingsid={vurderingselement.id}
            vurderingsversjonId={vurderingsversjon.versjon}
            onVurderingLagret={onVurderingLagret}
        />
    );
};

export default EndreVurdering;
