import { Config } from '../config';
export declare function getFuzzySearchResult(config: Config, text: string): Promise<object>;
export declare function serverNameFuzzySearchResult(config: Config, serverNameText: string): Promise<number>;
