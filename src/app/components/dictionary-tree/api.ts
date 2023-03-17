import axios, { AxiosResponse } from 'axios';
import { Observable, from, map } from 'rxjs';

interface RootClass {
    status: string;
    status_description: string;
    reply_type: string;
    classes?: OIDClass[];
    class?: OIDClass;
    _links: Links;
}

export interface OIDClass {
    'Presentation Name': string;
    'Dictionary OID': string;
    'DECmcc ID Code'?: string;
    Symbol?: string;
    Dynamic?: string;
    'Instance Required'?: string;
    'Instance Attributes'?: InstanceAttribute[];
    sub_classes?: Subclass[];
    attributes?: Subclass[];
    attribute_partitions?: Subclass[];
    events?: Subclass[];
    event_partitions?: Subclass[];
    event_groups?: Subclass[];
    directives?: Subclass[];
    _links: Links;
    [propName: string]: any;
}

interface Links {
    self: Self;
}

interface Self {
    href: string;
    type: string;
}

export interface Subclass {
    'Dictionary OID': string;
    'Presentation Name': string;
    _links: Links;
}

interface InstanceAttribute {
    'DECmcc ID Code': number;
    'Presentation Name': string;
}

export function getGlobalClasses() {
    const url = "/dict/classes";
    return from(axios.get(url)).pipe(
        map((res: AxiosResponse<RootClass>) => res.data?.classes));
}

export function getOIDObject(oid: string) {
    const url = `/dict/oid/${oid}`;
    return from(axios.get(url)).pipe(
        map((res: AxiosResponse<RootClass>) => res.data?.class));
}
