export declare const serverList: Array<Server>;
export declare enum Server {
    jp = 0,
    en = 1,
    tw = 2,
    cn = 3,
    kr = 4
}
export declare function getServerByName(name: string): Server;
export declare function getServerByPriority(content: Array<any>, displayedServerList?: Server[]): Server;
export declare function isServer(server: any): boolean;
export declare function isServerList(serverList: Array<any>): boolean;
