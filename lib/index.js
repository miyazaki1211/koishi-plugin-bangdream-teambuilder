var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Config: () => Config,
  apply: () => apply,
  getUserPlayerByUser: () => getUserPlayerByUser,
  logger: () => logger,
  name: () => name
});
module.exports = __toCommonJS(src_exports);
var import_koishi4 = require("koishi");
var import_remoteDB = require("./api/remoteDB");

// src/config.ts
var path = __toESM(require("path"));
var projectRoot = path.resolve(path.dirname(__dirname));
var assetsRootPath = path.join(projectRoot, "/assets");
var configPath = path.join(projectRoot, "/config");
var carKeywordPath = path.join(configPath, "/car_keyword.json");
var cacheRootPath = path.join(projectRoot, "/cache");
var bindingPlayerPromptWaitingTime = 5 * 60 * 1e4;
var globalDefaultServer = [3 /* cn */, 0 /* jp */];

// src/api/getReplyFromBackend.ts
var import_axios = __toESM(require("axios"));
var import_koishi = require("koishi");
var getReplyFromBackendLogger = new import_koishi.Logger("tsugu-getReplyFromBackend");
function base64ToList(basd64List) {
  const result = [];
  for (let i = 0; i < basd64List.length; i++) {
    const element = basd64List[i];
    if (element.type == "string") {
      result.push(element.string);
    } else if (element.type == "base64") {
      result.push(Buffer.from(element.string, "base64"));
    }
  }
  return result;
}
__name(base64ToList, "base64ToList");
async function sendPostRequest(url, data) {
  try {
    const response = await import_axios.default.post(url, data);
    const result = response.data;
    switch (response.status) {
      case 200:
        return result;
      case 400:
        return [{
          type: "string",
          string: `错误: 请求参数错误, 可能是版本与后端不一致`
        }];
      case 404:
        return [{
          type: "string",
          string: `错误: 无法连接至后端服务器`
        }];
      case 422:
        return [{
          type: "string",
          string: `错误: 无效的请求 (${result})`
        }];
      case 500:
        return [{
          type: "string",
          string: `内部错误`
        }];
      default:
        return [{
          type: "string",
          string: `错误: 未知错误`
        }];
    }
  } catch (error) {
    if (import_axios.default.isAxiosError(error)) {
      console.error("Axios Error:", error.message);
      return [{
        type: "string",
        string: "错误: 后端服务器连接出错"
      }];
    } else {
      console.error("Error:", error.message);
    }
    return [{
      type: "string",
      string: "内部错误"
    }];
  }
}
__name(sendPostRequest, "sendPostRequest");
async function getReplyFromBackend(url, data) {
  getReplyFromBackendLogger.info(url, data);
  const result = await sendPostRequest(url, data);
  return base64ToList(result);
}
__name(getReplyFromBackend, "getReplyFromBackend");

// src/utils.ts
var import_koishi2 = require("koishi");
function paresMessageList(list, session, config) {
  if (!list) {
    return [];
  }
  let messageList = [];
  for (let i = 0; i < list.length; i++) {
    parseMessage(list[i]);
  }
  function parseMessage(message) {
    if (typeof message == "string") {
      messageList.push(message);
    } else if (message instanceof Buffer) {
      messageList.push(import_koishi2.h.image(message, "image/png"));
    }
  }
  __name(parseMessage, "parseMessage");
  if (config.reply) {
    if (messageList.length > 0) {
      messageList.unshift((0, import_koishi2.h)("quote", { id: session.event.message.id }));
    }
  }
  return messageList;
}
__name(paresMessageList, "paresMessageList");

// src/api/getDataFromBackend.ts
var axios2 = __toESM(require("axios"));
var import_koishi3 = require("koishi");
var getDataFromBackendLogger = new import_koishi3.Logger("tsugu-getDataFromBackend");
async function getDataFromBackend(url, data) {
  getDataFromBackendLogger.info(url, data);
  const result = await axios2.default.post(url, data);
  if (result?.data?.status != "success") {
    return {};
  }
  return result.data.data;
}
__name(getDataFromBackend, "getDataFromBackend");

// src/api/fuzzySearch.ts
async function getFuzzySearchResult(config, text) {
  const result = await getDataFromBackend(`${config.backendUrl}/fuzzySearch`, {
    text
  });
  return result;
}
__name(getFuzzySearchResult, "getFuzzySearchResult");

// src/index.ts
var name = "bangdream-teambuilder";
var logger = new import_koishi4.Logger("teambuilder");
var Config = import_koishi4.Schema.object({
    useEasyBG: import_koishi4.Schema.boolean().default(false).description("是否使用简易背景, 启用大幅提高速度, 关闭画面更美观"),
    compress: import_koishi4.Schema.boolean().default(true).description("是否压缩图片, 启用后画质下降, 但速度更快体积更小, 关闭更清晰"),
    reply: import_koishi4.Schema.boolean().default(false).description("消息是否回复用户"),
    backendUrl: import_koishi4.Schema.string().required().description("后端服务器地址(必填), 处理指令与用户数据, 开始计算/PT计算也使用; 本机部署填 \"http://127.0.0.1:3000\"")
  }).description("Tsugu BangDream 组队计算器 配置");
function apply(ctx, config) {
  async function observeUserTsugu(session) {
    const platform = session.platform;
    const userId = session.userId;
    logger.info("[observeUserTsugu] 远程DB查询: backendUrl=%s, platform=%s, userId=%s", config.backendUrl, platform, userId);
    const remoteResult = await import_remoteDB.getRemoteDBUserData(config.backendUrl, platform, userId);
    logger.info("[observeUserTsugu] 远程DB返回: status=%s, data=%o", remoteResult.status, remoteResult.data);
    if (remoteResult.status == 'success') {
      logger.info("[observeUserTsugu] 使用远程DB数据, userPlayerList.length=%d", (remoteResult.data && remoteResult.data.userPlayerList) ? remoteResult.data.userPlayerList.length : 'N/A');
      return remoteResult.data;
    }
    logger.warn("[observeUserTsugu] 远程DB失败: %s", remoteResult.data);
    await session.send(remoteResult.data);
    return {
      userId,
      platform,
      mainServer: globalDefaultServer[0],
      displayedServerList: [...globalDefaultServer],
      shareRoomNumber: false,
      userPlayerIndex: 0,
      userPlayerList: []
    };
  }
  __name(observeUserTsugu, "observeUserTsugu");
  const cmd = ctx.command("组队计算 [eventId:number]").usage("选择需要计算的活动，查看已导入的配置").action(async ({ session }, eventId) => {
    const tsuguUserData = await observeUserTsugu(session);
    var playerInList;
    try {
      playerInList = getUserPlayerByUser(tsuguUserData, tsuguUserData.mainServer);
    } catch (e) {
      return e.message;
    }
    const result = await getReplyFromBackend(`${config.backendUrl}/teamBuildDetail`, {
      playerId: playerInList.playerId,
      mainServer: playerInList.server,
      compress: config.compress,
      useEasyBG: config.useEasyBG,
      eventId
    });
    return paresMessageList(result, session, config);
  });
  cmd.subcommand("查组队 [eventId:number] [id:number]", "查看推荐组队方案").example("查组队 287 : 查看活动287的最高分组队方案").example("查组队 287 2 : 查看活动287的其他推荐组队方案").action(async ({ session, options }, eventId, id) => {
    const tsuguUserData = await observeUserTsugu(session);
    const result = await getReplyFromBackend(`${config.backendUrl}/searchComposition`, {
      mainServer: tsuguUserData.mainServer,
      compress: config.compress,
      useEasyBG: config.useEasyBG,
      eventId,
      id
    });
    return paresMessageList(result, session, config);
  });
  cmd.subcommand("导入配置", "导入默认绑定账号主乐队数据").usage("导入主乐队卡牌、区域道具与角色加成数据").action(async ({ session }) => {
    const tsuguUserData = await observeUserTsugu(session);
    var playerInList;
    try {
      playerInList = getUserPlayerByUser(tsuguUserData, tsuguUserData.mainServer);
    } catch (e) {
      return e.message;
    }
    const result = await getReplyFromBackend(`${config.backendUrl}/teamBuildDetail/importPlayerData`, {
      playerId: playerInList.playerId,
      mainServer: playerInList.server,
      compress: config.compress,
      useEasyBG: config.useEasyBG
    });
    return paresMessageList(result, session, config);
  });
  cmd.subcommand("导入全部配置", "导入账号全部卡牌库存数据").usage("导入全部卡牌（默认四星及以上）、区域道具与角色加成数据\n⚠️ 会请求游戏接口使当前游戏客户端掉线一次\n⚠️ 需要先用 设置令牌 指令配置本人令牌").action(async ({ session }) => {
    const tsuguUserData = await observeUserTsugu(session);
    var playerInList;
    try {
      playerInList = getUserPlayerByUser(tsuguUserData, tsuguUserData.mainServer);
    } catch (e) {
      return e.message;
    }
    const result = await getReplyFromBackend(`${config.backendUrl}/teamBuildDetail/importAllPlayerData`, {
      playerId: playerInList.playerId,
      mainServer: playerInList.server,
      platform: session.platform,
      userId: session.userId,
      compress: config.compress,
      useEasyBG: config.useEasyBG
    });
    return paresMessageList(result, session, config);
  });
  cmd.subcommand("选择歌曲 [id:string] [songId:number] [difficultyText:string]", "自选组队的曲目和难度").usage("需要先发送组队计算指令确定活动id; PT计算使用的歌曲请用 协力歌曲 指令切换").example("选择歌曲 1 232 ex :将组队的第一首改为印尼虾ex").example("选择歌曲 123 306 ex :将组队三首全部改为sos ex").example("选择歌曲 all 306 ex :将组队三首全部改为sos ex").action(async ({ session }, id, songId, difficultyText) => {
    if (id == void 0 || songId == void 0 || difficultyText == void 0) {
      return `错误: 指令不完整, 请发送 help 选择歌曲`;
    }
    function parseId(id2) {
      if (id2 == "all") return -1;
      let res = 0;
      for (let i = 0; i < 3; i++) {
        if (id2.includes((i + 1).toString())) res |= 1 << i;
      }
      return res;
    }
    __name(parseId, "parseId");
    const tsuguUserData = await observeUserTsugu(session);
    var playerInList;
    try {
      playerInList = getUserPlayerByUser(tsuguUserData, tsuguUserData.mainServer);
    } catch (e) {
      return e.message;
    }
    const fuzzySearchResult = await getFuzzySearchResult(config, difficultyText);
    if (!fuzzySearchResult["difficulty"]) {
      return "错误: 难度名未能匹配任何难度";
    }
    const difficulty = fuzzySearchResult["difficulty"][0];
    const result = await getReplyFromBackend(`${config.backendUrl}/teamBuildDetail/updateSong`, {
      playerId: playerInList.playerId,
      mainServer: playerInList.server,
      compress: config.compress,
      useEasyBG: config.useEasyBG,
      id: parseId(id),
      songId,
      difficulty
    });
    return paresMessageList(result, session, config);
  });
  cmd.subcommand("重置歌曲", "将当前活动选择的歌曲还原为歌榜曲目").action(async ({ session }, id, songId, difficultyText) => {
    const tsuguUserData = await observeUserTsugu(session);
    var playerInList;
    try {
      playerInList = getUserPlayerByUser(tsuguUserData, tsuguUserData.mainServer);
    } catch (e) {
      return e.message;
    }
    const result = await getReplyFromBackend(`${config.backendUrl}/teamBuildDetail/resetSong`, {
      playerId: playerInList.playerId,
      mainServer: playerInList.server,
      compress: config.compress,
      useEasyBG: config.useEasyBG
    });
    return paresMessageList(result, session, config);
  });
  cmd.subcommand("一键升级", "将区域道具和角色加成等级设定为当前服务器最高等级").action(async ({ session }) => {
    const tsuguUserData = await observeUserTsugu(session);
    var playerInList;
    try {
      playerInList = getUserPlayerByUser(tsuguUserData, tsuguUserData.mainServer);
    } catch (e) {
      return e.message;
    }
    const result = await getReplyFromBackend(`${config.backendUrl}/teamBuildDetail/levelUp`, {
      playerId: playerInList.playerId,
      mainServer: playerInList.server,
      compress: config.compress,
      useEasyBG: config.useEasyBG
    });
    return paresMessageList(result, session, config);
  });
  cmd.subcommand("重置等级", "将区域道具和角色加成等级设置为0").action(async ({ session }) => {
    const tsuguUserData = await observeUserTsugu(session);
    var playerInList;
    try {
      playerInList = getUserPlayerByUser(tsuguUserData, tsuguUserData.mainServer);
    } catch (e) {
      return e.message;
    }
    const result = await getReplyFromBackend(`${config.backendUrl}/teamBuildDetail/levelReset`, {
      playerId: playerInList.playerId,
      mainServer: playerInList.server,
      compress: config.compress,
      useEasyBG: config.useEasyBG
    });
    return paresMessageList(result, session, config);
  });
  cmd.subcommand("添加卡牌 <word:text>", "根据关键词或卡牌ID添加卡组信息").usage("请使用空格隔开所有参数").option("skill_level", "-s <skill_level:number> 设定卡牌的技能等级，默认为5级", { fallback: 5 }).option("break_rank", "-b <break_rank:number> 设定卡牌的突破等级，默认为4级", { fallback: 4 }).example("添加卡牌 -s 1 -b 0 蓝 ppp 4x 5x <2171 :添加cool属性ppp的4x5x卡(活动287前), 技能等级1/突破0; 注意参数要写在筛选条件前").example("添加卡牌 2164 2165 2168 :添加卡面id为2164，2165，2168的三张卡并设定技能等级为5级，突破等级为4级").action(async ({ session, options }, text) => {
    if (text == void 0) {
      return `错误: 指令不完整, 请发送 help 添加卡牌`;
    }
    if (options.skill_level < 1 || options.skill_level > 5) {
      return "错误：技能等级应当为1~5级";
    }
    if (options.break_rank < 0 || options.break_rank > 4) {
      return "错误：突破等级应当为0~4级";
    }
    const tsuguUserData = await observeUserTsugu(session);
    var playerInList;
    try {
      playerInList = getUserPlayerByUser(tsuguUserData, tsuguUserData.mainServer);
    } catch (e) {
      return e.message;
    }
    const result = await getReplyFromBackend(`${config.backendUrl}/teamBuildDetail/addCard`, {
      playerId: playerInList.playerId,
      mainServer: playerInList.server,
      compress: config.compress,
      useEasyBG: config.useEasyBG,
      skill_level: options.skill_level,
      break_rank: options.break_rank,
      text
    });
    return paresMessageList(result, session, config);
  });
  cmd.subcommand("删除卡牌 <word:text>", "根据关键词或卡牌ID删除指定卡牌").usage("请使用空格隔开所有参数").example("删除卡牌 2164 2165 2168 :删除卡面id为2164，2165，2168的三张卡").example("删除卡牌 all :删除所有卡牌").action(async ({ session, options }, text) => {
    if (text == void 0) {
      return `错误: 指令不完整, 请发送 help 删除卡牌`;
    }
    if (text == "all") {
      text = ">0";
    }
    const tsuguUserData = await observeUserTsugu(session);
    var playerInList;
    try {
      playerInList = getUserPlayerByUser(tsuguUserData, tsuguUserData.mainServer);
    } catch (e) {
      return e.message;
    }
    const result = await getReplyFromBackend(`${config.backendUrl}/teamBuildDetail/delCard`, {
      playerId: playerInList.playerId,
      mainServer: playerInList.server,
      compress: config.compress,
      useEasyBG: config.useEasyBG,
      text
    });
    return paresMessageList(result, session, config);
  });
  cmd.subcommand("设置参数", "设置PT计算的计算参数").usage("可设置的参数（均为可选，不填则保持原值）:\n  -z <队友综合力> (0-420000, 默认400000)\n  -s <技能倍率> (10-170, 默认150即1.50x)\n  -t <持续时间> (5-8, 默认7)\n  -r <排名> (1-5, 默认1)\n  -w <输赢> (0或1, 默认1)\n  -b <支援综合力> (0-400000, 默认290000)").option("teammateStat", "-z <teammateStat:number> 队友综合力 (0-420000)").option("leaderScoreUpRaw", "-s <leaderScoreUpRaw:number> 技能倍率 (10-170)").option("leaderSkillDuration", "-t <leaderSkillDuration:number> 持续时间 (5-8)").option("teamRankInput", "-r <teamRankInput:number> 排名 (1-5)").option("festivalWon", "-w <festivalWon:number> 输赢 (0或1)").option("supportStat", "-b <supportStat:number> 支援综合力 (0-400000)").example("设置参数 -z 380000 -s 130 : 设置队友综合力38万，技能倍率1.30x").example("设置参数 -z 400000 -s 150 -t 7 -r 1 -w 1 -b 290000 : 全部参数设为默认值").action(async ({ session, options }) => {
    const hasOption = options.teammateStat !== void 0 || options.leaderScoreUpRaw !== void 0 || options.leaderSkillDuration !== void 0 || options.teamRankInput !== void 0 || options.festivalWon !== void 0 || options.supportStat !== void 0;
    if (!hasOption) {
      return `错误: 请至少提供一个参数, 发送 help 设置参数 查看帮助`;
    }
    if (options.teammateStat !== void 0 && (options.teammateStat < 0 || options.teammateStat > 420000)) {
      return "错误：队友综合力应当在 0~420000 之间";
    }
    if (options.leaderScoreUpRaw !== void 0 && (options.leaderScoreUpRaw < 10 || options.leaderScoreUpRaw > 170)) {
      return "错误：技能倍率应当在 10~170 之间";
    }
    if (options.leaderSkillDuration !== void 0 && (options.leaderSkillDuration < 5 || options.leaderSkillDuration > 8)) {
      return "错误：持续时间应当在 5~8 之间";
    }
    if (options.teamRankInput !== void 0 && (options.teamRankInput < 1 || options.teamRankInput > 5)) {
      return "错误：排名应当在 1~5 之间";
    }
    if (options.festivalWon !== void 0 && options.festivalWon !== 0 && options.festivalWon !== 1) {
      return "错误：输赢应当为 0 或 1";
    }
    if (options.supportStat !== void 0 && (options.supportStat < 0 || options.supportStat > 400000)) {
      return "错误：支援综合力应当在 0~400000 之间";
    }
    const tsuguUserData = await observeUserTsugu(session);
    var playerInList;
    try {
      playerInList = getUserPlayerByUser(tsuguUserData, tsuguUserData.mainServer);
    } catch (e) {
      return e.message;
    }
    const payload = {
      playerId: playerInList.playerId,
      mainServer: playerInList.server
    };
    if (options.teammateStat !== void 0) payload.teammateStat = options.teammateStat;
    if (options.leaderScoreUpRaw !== void 0) payload.leaderScoreUpRaw = options.leaderScoreUpRaw;
    if (options.leaderSkillDuration !== void 0) payload.leaderSkillDuration = options.leaderSkillDuration;
    if (options.teamRankInput !== void 0) payload.teamRankInput = options.teamRankInput;
    if (options.festivalWon !== void 0) payload.festivalWon = options.festivalWon === 1;
    if (options.supportStat !== void 0) payload.supportStat = options.supportStat;
    const result = await getReplyFromBackend(`${config.backendUrl}/teamBuildDetail/updatePtConfig`, payload);
    return paresMessageList(result, session, config);
  });
  cmd.subcommand("协力歌曲 <songId:number> <difficultyText:string>", "设置PT计算使用的歌曲").usage("格式: 协力歌曲 {歌曲id} {ez|nm|hd|ex|sp}").example("协力歌曲 232 ex : 设置PT计算歌曲为印尼虾ex").action(async ({ session }, songId, difficultyText) => {
    if (songId === void 0) {
      return `错误: 缺少歌曲id, 请发送 help 协力歌曲`;
    }
    const diffMap = { ez: 0, nm: 1, hd: 2, ex: 3, sp: 4 };
    const diffKey = (difficultyText || "").toLowerCase().trim();
    if (!(diffKey in diffMap)) {
      return "错误：难度应当为 ez、nm、hd、ex、sp 之一";
    }
    const difficulty = diffMap[diffKey];
    const tsuguUserData = await observeUserTsugu(session);
    var playerInList;
    try {
      playerInList = getUserPlayerByUser(tsuguUserData, tsuguUserData.mainServer);
    } catch (e) {
      return e.message;
    }
    const result = await getReplyFromBackend(`${config.backendUrl}/ptMaximize/updatePtSong`, {
      playerId: playerInList.playerId,
      mainServer: playerInList.server,
      songId,
      difficulty
    });
    return paresMessageList(result, session, config);
  });
  cmd.subcommand("开始计算", "开始计算最大化最高分数的配队方案，计算时间较长").userFields(["authority"]).option("save", "-s [description:text] 保存到数据库并添加备注，需要权限").action(async ({ session, options }) => {
    const tsuguUserData = await observeUserTsugu(session);
    var playerInList;
    try {
      playerInList = getUserPlayerByUser(tsuguUserData, tsuguUserData.mainServer);
    } catch (e) {
      return e.message;
    }
    const save = options.save != void 0 && session.user.authority == 5 ? true : false;
    const description = save && options.save !== "" ? options.save : void 0;
    const result = await getReplyFromBackend(`${config.backendUrl}/calcResult`, {
      playerId: playerInList.playerId,
      mainServer: playerInList.server,
      compress: config.compress,
      useEasyBG: config.useEasyBG,
      save,
      description
    });
    return paresMessageList(result, session, config);
  });
  cmd.subcommand("PT计算 [eventId:number]", "计算活动PT配队方案（评估期望PT收益）").option("liveVariant", "-l <liveVariant:string> 玩法变体: solo|cooperative|versus|festival|medley|challenge_cp，不指定则自动选择").action(async ({ session, options }, eventId) => {
    const tsuguUserData = await observeUserTsugu(session);
    var playerInList;
    try {
      playerInList = getUserPlayerByUser(tsuguUserData, tsuguUserData.mainServer);
    } catch (e) {
      return e.message;
    }
    const payload = {
      playerId: playerInList.playerId,
      mainServer: playerInList.server,
      compress: config.compress,
      useEasyBG: config.useEasyBG,
      eventId
    };
    if (options.liveVariant) {
      payload.liveVariant = options.liveVariant;
    }
    const result = await getReplyFromBackend(`${config.backendUrl}/ptMaximize`, payload);
    return paresMessageList(result, session, config);
  });
  cmd.subcommand("自动控分 <currentPt:integer> <targetPt:integer> [supportStat:integer]", "搜索当前活动的控分方案").usage("搜索从当前PT到目标PT的演奏方案; 活动为当前活动, 使用绑定的主服务器玩家; 任务live活动需传入支援综合力").example("自动控分 100000 101000 :搜索从100000到101000PT的控分方案").example("自动控分 100000 101000 290000 :任务live需传入支援综合力290000").action(async ({ session }, currentPt, targetPt, supportStat) => {
    if (!Number.isInteger(currentPt) || !Number.isInteger(targetPt)) {
      return `错误: 指令不完整, 请发送 help 自动控分`;
    }
    if (currentPt < 0 || targetPt < 0) {
      return "错误: PT必须为非负整数";
    }
    if (targetPt <= currentPt) {
      return "错误: 目标PT必须大于当前PT";
    }
    if (targetPt - currentPt > 10000) {
      return "错误: 目标PT与当前PT的分差不能超过10000";
    }
    if (supportStat != void 0 && (!Number.isInteger(supportStat) || supportStat < 0)) {
      return "错误: 支援队伍综合力必须为非负整数";
    }
    const tsuguUserData = await observeUserTsugu(session);
    var playerInList;
    try {
      playerInList = getUserPlayerByUser(tsuguUserData, tsuguUserData.mainServer);
    } catch (e) {
      return e.message;
    }
    const result = await getReplyFromBackend(`${config.backendUrl}/scoreRange`, {
      playerId: playerInList.playerId,
      mainServer: playerInList.server,
      currentPt,
      targetTotalPt: targetPt,
      supportStat: supportStat ?? null,
      useEasyBG: config.useEasyBG,
      compress: config.compress
    });
    return paresMessageList(result, session, config);
  });
  cmd.subcommand("微操计算", "计算绑定玩家在当前活动选定歌曲上的微操理论最高分").usage("队伍来自开始计算结果, 歌曲与难度来自选择歌曲设置\n仅支持挑战/对邦类型活动, 计算可能需要数分钟").example("微操计算 :返回当前活动选定歌曲的理论最高分与微操谱面图").action(async ({ session }) => {
    const tsuguUserData = await observeUserTsugu(session);
    var playerInList;
    try {
      playerInList = getUserPlayerByUser(tsuguUserData, tsuguUserData.mainServer);
    } catch (e) {
      return e.message;
    }
    const result = await getReplyFromBackend(`${config.backendUrl}/microOptimize`, {
      playerId: playerInList.playerId,
      mainServer: playerInList.server,
      compress: false, // 微操谱面细节多, 固定 PNG 不压缩
      useEasyBG: config.useEasyBG
    });
    return paresMessageList(result, session, config);
  });
}
__name(apply, "apply");
function getUserPlayerByUser(tsuguUser2, server, index) {
  server ??= tsuguUser2.mainServer;
  const userPlayerList = tsuguUser2.userPlayerList;
  const userPlayerIndex = index ?? tsuguUser2.userPlayerIndex;
  if (userPlayerList.length == 0) {
    throw new Error("错误: 未绑定玩家, 请发送[绑定玩家]开始绑定");
  }
  if (index != void 0) {
    return userPlayerList[index];
  }
  if (tsuguUser2.userPlayerList[userPlayerIndex].server == server) {
    return userPlayerList[userPlayerIndex];
  }
  for (let i = 0; i < userPlayerList.length; i++) {
    const userPlayerInList = userPlayerList[i];
    if (userPlayerInList.server == server) {
      return userPlayerInList;
    }
  }
  throw new Error("用户在对应服务器上未绑定player");
}
__name(getUserPlayerByUser, "getUserPlayerByUser");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  apply,
  getUserPlayerByUser,
  logger,
  name
});
