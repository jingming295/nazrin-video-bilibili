import { Context, Logger } from 'koishi';
import { BilibiliSearch } from './api/BilibiliSearch';
import { } from 'koishi-plugin-bilibili-login';

// 导入nazrin核心
import { } from 'koishi-plugin-nazrin-core';
// 声明使用nazrin核心
export const inject = ['nazrin', 'bilibiliLogin'];
export const name = 'nazrin-video-bilibili';



export * from './api/config/index';
interface Config
{
  SESSDATA: string;
  buvid3: string;
  qn: number;
}

export async function apply(ctx: Context, config: Config)
{
  const logger = new Logger('iirose-media-request');

  try
  {
    const thisPlatform = 'bilibili';
    if (!ctx.nazrin.video.includes(thisPlatform))
    {
      ctx.nazrin.video.push(thisPlatform);
    }
    ctx.on('nazrin/video', async (ctx: Context, keyword: string) =>
    {
      ctx.inject(['bilibiliLogin'], async (ctx) =>
      {
        const bilibiliAccountData = await ctx.bilibiliLogin.getBilibiliAccountData();
        if (!bilibiliAccountData) return;
        const bilibiliSearch = new BilibiliSearch(thisPlatform);
        const findList = await bilibiliSearch.search(keyword, bilibiliAccountData.SESSDATA);
        return ctx.emit('nazrin/search_over', findList);
      });
    });


    ctx.on('nazrin/parse_video', async (ctx: Context, platform, url, data: VideoData) =>
    {
      if (platform !== thisPlatform) return;  // 判断是否为本平台的解析请求
      const bilibiliSearch = new BilibiliSearch(thisPlatform);

      ctx.inject(['bilibiliLogin'], async (ctx) =>
      {
        const bilibiliAccountData = await ctx.bilibiliLogin.getBilibiliAccountData();
        if (!bilibiliAccountData) return;
        const videoResource = await bilibiliSearch.returnVideoResource(data, bilibiliAccountData.SESSDATA, config["qn"]);
        if (!videoResource) return;
        ctx.emit('nazrin/parse_over',
          videoResource.url,
          videoResource.name,
          videoResource.author,
          videoResource.cover,
          videoResource.duration,
          videoResource.bitRate,
          videoResource.color);
      });
    });
  } catch (error)
  {
    logger.warn(error)
  }

}
