import { Context, Logger } from 'koishi';
import { BilibiliSearch } from './api/BilibiliSearch';
import { BVideoDetail } from 'koishi-plugin-bilibili-login';

// 导入nazrin核心
import { } from 'koishi-plugin-nazrin-core';
// 声明使用nazrin核心
export const inject = ['nazrin', 'BiliBiliSearch', 'BiliBiliVideo'];
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
      ctx.inject(['BiliBiliSearch', 'BiliBiliVideo'], async (ctx) =>
      {
        const bs = ctx.BiliBiliSearch;
        const bv = ctx.BiliBiliVideo;
        const bilibiliSearch = new BilibiliSearch(thisPlatform);
        const findList = await bilibiliSearch.search(bs,bv, keyword);
        return ctx.emit('nazrin/search_over', findList);
      });
    });


    ctx.on('nazrin/parse_video', async (ctx: Context, platform, url, data: BVideoDetail) =>
    {
      if (platform !== thisPlatform) return;  // 判断是否为本平台的解析请求
      const bilibiliSearch = new BilibiliSearch(thisPlatform);

      ctx.inject(['BiliBiliVideo'], async (ctx) =>
      {
        const bv = ctx.BiliBiliVideo;
        const videoResource = await bilibiliSearch.returnVideoResource(bv, data, config["qn"]);
        if (!videoResource) return;
        ctx.emit('nazrin/parse_over',
          videoResource.url,
          videoResource.name,
          videoResource.author,
          videoResource.cover,
          videoResource.duration,
          videoResource.bitRate,
          videoResource.color,
          'bilibili'
          );
      });
    });
  } catch (error)
  {
    logger.warn(error);
  }

}
