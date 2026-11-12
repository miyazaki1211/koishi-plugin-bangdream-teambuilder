"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemoteDBUserData = void 0;
var axios_1 = __importDefault(require("axios"));
var koishi_1 = require("koishi");
var remoteDBLogger = new koishi_1.Logger("teambuilder-remoteDB");
var statusCodeList = [200, 409, 422];
function parseError(e) {
    if (e.response && e.response.status == 404 && e.response.data && e.response.data.data == '错误: 服务器未启用数据库') {
        return {
            status: 'fail',
            data: '错误: 远程服务器未启用数据库',
        };
    }
    remoteDBLogger.error(e.response);
    return {
        status: 'fail',
        data: (e.response === null || e.response === void 0 ? void 0 : e.response.data) || '错误: 远程服务器未知错误或无法连接至服务器',
    };
}
async function getRemoteDBUserData(RemoteDBUrl, platform, userId) {
    try {
        var postPath = '/user/getUserData';
        var postData = { platform: platform, userId: userId };
        remoteDBLogger.info("".concat(RemoteDBUrl).concat(postPath), postData);
        var result = await axios_1.default.post("".concat(RemoteDBUrl).concat(postPath), postData);
        if (!statusCodeList.includes(result.status)) {
            throw new Error();
        }
        return result.data;
    }
    catch (e) {
        return parseError(e);
    }
}
exports.getRemoteDBUserData = getRemoteDBUserData;
async function setRemoteDBUserData(RemoteDBUrl, platform, userId, update) {
    try {
        var postPath = '/user/changeUserData';
        var postData = { platform: platform, userId: userId, update: update };
        remoteDBLogger.info("".concat(RemoteDBUrl).concat(postPath), postData);
        var result = await axios_1.default.post("".concat(RemoteDBUrl).concat(postPath), postData);
        if (!statusCodeList.includes(result.status)) {
            throw new Error();
        }
        return result.data;
    }
    catch (e) {
        return parseError(e);
    }
}
exports.setRemoteDBUserData = setRemoteDBUserData;
