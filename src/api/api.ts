import { CancelToken } from 'axios';
import { Vurderingsversjon } from '../types/Vurdering';
import Vurderingstype from '../types/Vurderingstype';
import { post } from '../util/httpUtils';
import { PerioderMedEndringResponse } from '../types/PeriodeMedEndring';
import { Period } from '../types/Period';
import { RequestPayload } from '../types/RequestPayload';
import { HttpErrorHandler } from '../types/HttpErrorHandler';

type VurderingsversjonMedType = Partial<Vurderingsversjon> & {
    type: Vurderingstype;
};

export async function postNyVurdering(
    href: string,
    behandlingUuid: string,
    vurderingsversjonMedType: VurderingsversjonMedType,
    httpErrorHandler: HttpErrorHandler,
    cancelToken?: CancelToken,
    dryRun?: boolean
): Promise<any> {
    try {
        const { perioder, resultat, tekst, dokumenter, type } = vurderingsversjonMedType;
        return post(
            href,
            {
                behandlingUuid,
                type,
                perioder,
                resultat,
                tekst,
                tilknyttedeDokumenter: dokumenter.map((dokument) => dokument.id),
                dryRun: dryRun || false,
            },
            httpErrorHandler,
            { cancelToken }
        );
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export async function postNyVurderingDryRun(
    href: string,
    behandlingUuid: string,
    vurderingsversjonMedType: VurderingsversjonMedType,
    httpErrorHandler: HttpErrorHandler,
    cancelToken?: CancelToken
): Promise<PerioderMedEndringResponse> {
    return postNyVurdering(href, behandlingUuid, vurderingsversjonMedType, httpErrorHandler, cancelToken, true);
}

interface InnleggelsesperioderRequestBody extends RequestPayload {
    perioder: Period[];
}

export interface InnleggelsesperiodeDryRunResponse {
    førerTilRevurdering: boolean;
}

export async function postInnleggelsesperioder(
    href: string,
    body: InnleggelsesperioderRequestBody,
    httpErrorHandler: HttpErrorHandler,
    cancelToken?: CancelToken,
    dryRun?: boolean
) {
    return post(href, { ...body, dryRun: dryRun || false }, httpErrorHandler, { cancelToken });
}

export async function postInnleggelsesperioderDryRun(
    href: string,
    body: InnleggelsesperioderRequestBody,
    httpErrorHandler: HttpErrorHandler,
    cancelToken?: CancelToken
): Promise<InnleggelsesperiodeDryRunResponse> {
    return postInnleggelsesperioder(href, body, httpErrorHandler, cancelToken, true);
}
