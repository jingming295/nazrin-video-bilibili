import { Schema } from "koishi";
export interface Config { }

export const Config: Schema<Config> = Schema.intersect([
    Schema.object({
        SESSDATA: Schema.string().required().description('bilibili的SESSDATA，cookie里找，必填'),
        buvid3: Schema.string().required().description('bilibili的buvid3，cookie里找，必填'),
    }).description('bilibili相关设置'),

  
  ]);