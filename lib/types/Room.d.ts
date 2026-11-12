import { userPlayerInList } from "../config";
import { Player } from "./Player";
interface RoomOption {
    number: number;
    rawMessage: string;
    source: string;
    userId: string;
    time: number;
    avatarUrl?: string;
    userName?: string;
    bandoriStationToken?: string;
}
export declare class Room {
    number: number;
    rawMessage: string;
    source: string;
    userId: string;
    time: number;
    player: userPlayerInList;
    avatarUrl?: string;
    userName?: string;
    constructor({ number, rawMessage, source, userId, time, avatarUrl, userName }: RoomOption);
    setPlayer(player: Player): void;
}
export declare function queryAllRoom(): Promise<Room[]>;
export declare function queryRoomNumberFromBandoriStation(): Promise<Room[]>;
export declare function submitRoomNumber({ number, rawMessage, source, userId, time, userName, bandoriStationToken, avatarUrl }: RoomOption, userpPlayerInList?: userPlayerInList): Promise<void>;
export {};
