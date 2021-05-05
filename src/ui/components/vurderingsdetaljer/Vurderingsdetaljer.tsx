import React from 'react';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import VurderingsdetaljvisningForEksisterendeVurdering from '../vurderingsdetaljvisning-for-eksisterende-vurdering/VurderingsdetaljvisningForEksisterendeVurdering';
import VurderingsdetaljvisningForNyVurdering from '../vurderingsdetaljvisning-for-ny-vurdering/VurderingsdetaljvisningForNyVurdering';

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

    let valgtVurderingContent = null;
    if (valgtVurderingselement) {
        valgtVurderingContent = (
            <VurderingsdetaljvisningForEksisterendeVurdering
                vurderingsoversikt={vurderingsoversikt}
                vurderingselement={valgtVurderingselement}
                editMode={editMode}
                onEditClick={() => setEditMode(true)}
                onAvbrytClick={() => setEditMode(false)}
                onVurderingLagret={onVurderingLagret}
            />
        );
    }

    const harValgtVurderingselement = !!valgtVurderingselement;
    return (
        <>
            {harValgtVurderingselement && valgtVurderingContent}
            <div style={{ display: harValgtVurderingselement || !visNyVurderingForm ? 'none' : '' }}>
                <VurderingsdetaljvisningForNyVurdering
                    vurderingsoversikt={vurderingsoversikt}
                    radForNyVurderingErSynlig={visRadForNyVurdering}
                    onAvbryt={onAvbryt}
                    onVurderingLagret={onVurderingLagret}
                />
            </div>
        </>
    );
};

export default Vurderingsdetaljer;
