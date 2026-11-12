export declare const projectRoot: string;
export declare const assetsRootPath: string;
export declare const configPath: string;
export declare const carKeywordPath: string;
export declare const cacheRootPath: string;
export declare const bindingPlayerPromptWaitingTime: number;
export declare const Bestdoriurl: string;
export declare const BandoriStationurl: string;
export declare enum Server {
    jp = 0,
    en = 1,
    tw = 2,
    cn = 3,
    kr = 4
}
export declare const globalDefaultServer: Array<Server>;
export declare const globalServerPriority: Array<Server>;
export declare const serverNameFullList: string[];
export declare const tierListOfServer: {
    jp: number[];
    tw: number[];
    en: number[];
    kr: number[];
    cn: number[];
};
export interface tsuguUser {
    userId: string;
    platform: string;
    mainServer: Server;
    displayedServerList: Server[];
    shareRoomNumber: boolean;
    userPlayerIndex: number;
    userPlayerList: userPlayerInList[];
}
export interface userPlayerInList {
    playerId: number;
    server: Server;
}
export declare function getUserPlayerByUser(tsuguUser: tsuguUser, server?: Server): userPlayerInList;
export interface Channel {
    tsuguGacha: boolean;
}
export interface Config {
    useEasyBG: boolean;
    compress: boolean;
    bandoriStationToken: string;
    backendUrl: string;
    reply: boolean;
    at: boolean;
}
