import RequestPayload from './RequestPayload';

interface Links {
    href: string;
    rel: string;
    requestPayload: RequestPayload;
    type: string;
}

export default Links;
