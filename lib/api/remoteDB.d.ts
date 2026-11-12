import { tsuguUser } from '../config';
import { Logger } from 'koishi';
export declare const remoteDBLogger: Logger;
export declare function getRemoteDBUserData(RemoteDBUrl: string, platform: string, userId: string): Promise<{
    status: string;
    data: tsuguUser | string;
}>;
export declare function changeUserData(RemoteDBUrl: string, platform: string, userId: string, update: Partial<tsuguUser>): Promise<{
    status: string;
    data: string;
}>;
export declare function bindPlayerRequest(RemoteDBUrl: string, platform: string, userId: string): Promise<{
    status: string;
    data: string | {
        verifyCode: number;
    };
}>;
export declare function bindPlayerVerify(RemoteDBUrl: string, platform: string, userId: string, server: number, playerId: number, bindingAction: 'bind' | 'unbind'): Promise<{
    status: string;
    data: string;
}>;
