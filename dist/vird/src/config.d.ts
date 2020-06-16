export interface VirdConfig {
    binding: RegExp | null;
}
export declare const config: VirdConfig;
export declare function setBindingConfig(startBracket: RegExp): void;
export declare function setBindingConfig(startBracket: string, endBracket?: string): void;
export declare function setBindingConfig(startBracket: string, space: string, endBracket: string): void;
export declare function setBindingConfig(startBracket: string | RegExp, space?: string, endBracket?: string): void;
