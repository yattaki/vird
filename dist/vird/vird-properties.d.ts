import { VirdNode } from '../vird-node/vird-node';
import { VirdEventProperties, VirdEventValue } from './vird-event';
export declare type VirdProperties = {
    [K in string]: VirdEventValue<K> | string;
} & VirdEventProperties;
export interface ParseVirdPropertiesResult {
    events: {
        [key: string]: VirdEventValue;
    };
    properties: VirdNode['properties'];
}
export declare function parseVirdProperties(params: Partial<VirdProperties>): ParseVirdPropertiesResult;
