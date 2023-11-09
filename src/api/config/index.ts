import { Schema } from "koishi";
export interface Config { }

export const Config: Schema<Config> = Schema.intersect([
    Schema.object({
        qn: Schema.union([
            Schema.const(6),
            Schema.const(16),
            Schema.const(64),
            Schema.const(74),
            Schema.const(80),
            Schema.const(112).experimental(),
            Schema.const(116).experimental(),
            Schema.const(120).experimental(),
            Schema.const(125).experimental(),
            Schema.const(126).experimental(),
            Schema.const(127).experimental(),
          ]).default(80).description('视频的清晰度，具体看https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/info.md'),
    }).description('bilibili相关设置'),
]);