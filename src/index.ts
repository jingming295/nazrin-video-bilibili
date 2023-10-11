import { Context, Schema } from 'koishi';
import { BilibiliSearch, tempData } from './api/BilibiliSearch';

// 导入nazrin核心
import { } from 'koishi-plugin-nazrin-core';

export const name = 'nazrin-video-bilibili';


export * from './api/config/index';


export function apply(ctx: Context, config: any)
{
  if (!config["SESSDATA"]) return;
  const thisPlatform = 'bilibili';
  if (!ctx.nazrin.video.includes(thisPlatform))
  {
    ctx.nazrin.video.push(thisPlatform);
  }

  ctx.on('nazrin/video', async keyword =>
  {
    console.log(`keyword: ${keyword}`);
    const bilibiliSearch = new BilibiliSearch(thisPlatform, config["SESSDATA"], config["buvid3"]);

    const findList = await bilibiliSearch.search(keyword);
    return ctx.emit('nazrin/search_over', findList);
  });


  ctx.on('nazrin/parse_video', async (platform, url, data) =>
  {
    if (platform !== thisPlatform) return;  // 判断是否为本平台的解析请求
    const bilibiliSearch = new BilibiliSearch(thisPlatform, config["SESSDATA"], config["buvid3"]);

    const videoResource = await bilibiliSearch.returnVideoResource(data, config["qn"]);
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
}
