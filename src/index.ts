import { Context, Schema } from 'koishi';
import { BilibiliSearch } from './api/BilibiliSearch'

// 导入nazrin核心
import { } from 'koishi-plugin-nazrin-core';

export const name = 'nazrin-video-bilibili';


export * from './api/config/index'


export function apply(ctx: Context, config:any)
{
  // write your plugin here
  if(!config["SESSDATA"]) return
  const thisPlatform = 'bilibili';
  ctx.nazrin.music.push(thisPlatform);
  
  ctx.on('nazrin/video', async keyword =>
  {
    
    const bilibiliSearch = new BilibiliSearch()
    
    bilibiliSearch.search(keyword, config["SESSDATA"], config["buvid3"])


  });
}
