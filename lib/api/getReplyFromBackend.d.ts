import { Logger } from 'koishi';
export declare const getReplyFromBackendLogger: Logger;
export declare function getReplyFromBackend(url: string, data: any): Promise<Array<Buffer | string>>;
