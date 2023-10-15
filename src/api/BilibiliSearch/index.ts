import axios from 'axios';
import { Logger } from 'koishi';
import { BiliBiliApi } from '../BiliBiliApi';
export class BilibiliSearch
{
    thisPlatform: string;
    private logger: Logger;
    constructor(thisPlatform: string)
    {
        this.thisPlatform = thisPlatform;
        this.logger = new Logger('nazrin-video-bilibili');
    }
    /**
     * 搜索阶段的函数
     * @param keyword 关键词
     * @param SESSDATA bilibili的SESSDATA
     * @param buvid3 bilibili的buvid3
     * @returns 
     */
    public async search(keyword: string, SESSDATA: string, buvid3: string)
    {
        const biliBiliApi = new BiliBiliApi();

        function isVideo(item: bili_userData | video): item is video
        {
            return 'id' in item && 'author' in item && 'typeid' in item && 'typename' in item;
        }

        let resultData = [] as video[];

        const data = await biliBiliApi.getBilibiliVideoSearchData(keyword, SESSDATA, buvid3, this.logger);

        if (!data || !data.result)
        {
            return this.returnErr();
        }

        if (data.result[11] && Array.isArray(data.result[11].data) && data.result[11].data.every(isVideo))
        {
            resultData = data.result[11].data;
        } else if (data.result[10] && Array.isArray(data.result[10].data) && data.result[10].data.every(isVideo))
        {
            resultData = data.result[10].data;
        } else
        {
            this.logger.info('搜索阶段没有找到video或者符合video结构的result');
            return this.returnErr();
        }

        const avid: number[] = resultData.map((item: video) => item.aid);

        const promises = avid.map(async avid =>
        {
            return await biliBiliApi.getBilibiliVideoDetailByAid(avid, SESSDATA, this.logger);
        });

        const videoData = await Promise.all(promises);

        const processedData = videoData.map(videoData =>
        {
            if (videoData === null)
            {
                return {
                    name: '无法获取',
                    author: '无法获取',
                    cover: '无法获取',
                    url: null,
                    platform: this.thisPlatform,
                    err: false,
                    data: null
                };
            }

            const backObj = {
                name: videoData.title || '无法获取',
                author: videoData.owner.name || '无法获取',
                cover: videoData.pic || '无法获取',
                url: null,
                platform: this.thisPlatform,
                err: false,
                data: videoData
            };

            return backObj;
        });

        return processedData;
    }

    /**
     * 返回videoResource
     * @param data VideoData
     * @param SESSDATA SESSDATA
     * @param biliBiliqn biliBiliqn
     * @returns VideoResource
     */
    public async returnVideoResource(data: VideoData, SESSDATA: string, biliBiliqn: number)
    {
        let biliBiliPlatform = 'pc';
        const biliBiliApi = new BiliBiliApi;
        const avid = data.aid;
        const bvid = data.bvid;
        const cid = data.cid;

        let duration: number;
        const name = data.title;
        const author = data.owner.name;
        const cover = data.pic;
        const color = 'FFFFFF';

        if (data.pages) duration = this.getDurationByCid(data.pages, data.cid);
        else duration = data.duration + 1;

        let videoStream = await biliBiliApi.getBilibiliVideoStream(avid, bvid, cid, SESSDATA, biliBiliPlatform, biliBiliqn, this.logger);

        while (await this.checkResponseStatus(videoStream.durl[0].url) === false)
        {
            biliBiliPlatform = 'html5';
            if (biliBiliPlatform === 'html5')
            {
                biliBiliqn = this.changeBilibiliQn(biliBiliqn);
            }
            videoStream = await biliBiliApi.getBilibiliVideoStream(avid, bvid, cid, SESSDATA, biliBiliPlatform, biliBiliqn, this.logger);
            if (biliBiliqn === 6) break;
        }
        const url = videoStream.durl[0].url;

        const bitrate = this.getQuality(videoStream.quality);

        return this.returnCompleteVideoResource(url, name, author, cover, duration, bitrate, color);


    }

    /**
     * 返回错误的findlist
     * @returns findList
     */
    private returnErr()
    {
        const findList = [
            {
                err: true,
                platform: this.thisPlatform
            }
        ];

        return findList;

    }

    /**
     * 根据cid获得时长
     * @param pages Page[]
     * @param cid cid
     * @returns 
     */
    private getDurationByCid(pages: Page[], cid: number)
    {
        const page = pages.find((page: { cid: number; }) => page.cid === cid);
        return page!.duration; // 使用非空断言操作符
    }

    /**
     * 返回完整的VideoResource
     * @param url 
     * @param name 
     * @param author 
     * @param cover 
     * @param duration 
     * @param bitRate 
     * @param color 
     * @returns 
     */
    private returnCompleteVideoResource(url: string, name: string, author: string, cover: string, duration: number, bitRate: number, color: string)
    {
        const VideoResource: VideoResource = {
            url: url,
            name: name,
            author: author,
            cover: cover,
            duration: duration,
            bitRate: bitRate,
            color: color,
            error: null
        };
        return VideoResource;
    }



    /**
     * 根据qn获取quality
     * @param qn bilibili qn 
     * @returns 
     */
    private getQuality(qn: number)
    {
        switch (qn)
        {
            case 127://8k
                return 8000;
            case 126://杜比视界
                return 1080; //不确定，乱填
            case 125://HDR 真彩色
                return 1080; //不确定，乱填
            case 120://4k
                return 4000;
            case 116://1080p60帧
                return 1080;
            case 112://1080p高码率
                return 1080;
            case 80:
                return 1080;
            case 74: //720p60帧
                return 720;
            case 64:
                return 720;
            case 16:// 未登录的默认值
                return 360;
            case 6://仅 MP4 格式支持, 仅platform=html5时有效
                return 240;
            default:
                return 720;
        }
    }

    /**
     * 检查看看一个url是否返回403，或者无法访问
     * @param url  链接
     * @returns boolean
     */
    private async checkResponseStatus(url: string)
    {
        try
        {
            const response = await axios.get(url, {
                headers: {
                    Referer: 'no-referrer',
                    Range: 'bytes=0-1'
                }
            });
            if (response.status === 403 || response.status === 410)
            {
                return false;
            } else
            {
                return true;
            }
        } catch (error)
        {
            this.logger.error(error);
            return false;
        }
    }

    /**
     * 更换bilibiliQn
     * @param biliBiliqn biliBiliqn
     */
    private changeBilibiliQn(biliBiliqn: number)
    {
        switch (biliBiliqn)
        {
            case 127: // 8k
                biliBiliqn = 126;
                break;
            case 126: // 杜比视界
                biliBiliqn = 125;
                break;
            case 125: // HDR 真彩色
                biliBiliqn = 120;
                break;
            case 120: // 4k
                biliBiliqn = 116;
                break;
            case 116: // 1080p60帧
                biliBiliqn = 112;
                break;
            case 112: // 1080p高码率
                biliBiliqn = 80;
                break;
            case 80:
                biliBiliqn = 74;
                break;
            case 74: // 720p60帧
                biliBiliqn = 64;
                break;
            case 64:
                biliBiliqn = 16;
                break;
            case 16: // 未登录的默认值
                biliBiliqn = 6;
                break;
            case 6: //仅 MP4 格式支持, 仅platform=html5时有效
                break;
        }
        return biliBiliqn;
    }
}