import { Logger, Schema } from 'koishi';
import { Server } from './types/Server';
import { tsuguUser } from './config';
export declare const name = "bangdream-teambuilder";
export declare const logger: Logger;
declare module 'koishi' {
    interface User {
        tsugu: {
            userId: string;
            platform: string;
            mainServer: Server;
            displayedServerList: Server[];
            shareRoomNumber: boolean;
            userPlayerIndex: number;
            userPlayerList: {
                playerId: number;
                server: Server;
            }[];
        };
    }
}
export declare const Config: Schema<Schemastery.ObjectS<{
    useEasyBG: Schema<boolean, boolean>;
    compress: Schema<boolean, boolean>;
    reply: Schema<boolean, boolean>;
    backendUrl: Schema<string, string>;
}>, {
    useEasyBG: boolean;
    compress: boolean;
    reply: boolean;
    backendUrl: string;
} & import("cosmokit").Dict>;
export declare function apply(ctx: any, config: any): void;
export interface userPlayerInList {
    playerId: number;
    server: Server;
}
export declare function getUserPlayerByUser(tsuguUser: tsuguUser, server?: Server, index?: number): userPlayerInList;
