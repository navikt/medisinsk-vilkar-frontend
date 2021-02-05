import axios, { AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios';
import Link from '../types/Link';
import { Vurderingsversjon } from '../types/Vurdering';
import Vurderingstype from '../types/Vurderingstype';
import { PerioderMedEndringResponse } from '../types/PeriodeMedEndring';

type VurderingsversjonMedType = Partial<Vurderingsversjon> & {
    type: Vurderingstype;
};

export async function postNyVurdering(
    link: Link,
    vurderingsversjonMedType: VurderingsversjonMedType,
    cancelToken?: CancelToken,
    dryRun?: boolean
): Promise<any> {
    try {
        const { perioder, resultat, tekst, dokumenter, type } = vurderingsversjonMedType;
        const response: AxiosResponse<void> = await axios.post(
            link.href,
            {
                behandlingUuid: link.requestPayload.behandlingUuid,
                type,
                perioder,
                resultat,
                tekst,
                tilknyttedeDokumenter: dokumenter,
                dryRun: dryRun || false,
            },
            { cancelToken }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export async function postNyVurderingDryRun(
    link: Link,
    vurderingsversjonMedType: VurderingsversjonMedType,
    cancelToken?: CancelToken
): Promise<PerioderMedEndringResponse> {
    return postNyVurdering(link, vurderingsversjonMedType, cancelToken, true);
}

export async function fetchData<T>(url: string, requestConfig?: AxiosRequestConfig): Promise<T> {
    try {
        const response: AxiosResponse<T> = await axios.get(url, requestConfig);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export async function submitData<T>(url: string, body: T, requestConfig?: AxiosRequestConfig): Promise<any> {
    try {
        const response: AxiosResponse = await axios.post(url, body, requestConfig);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}
