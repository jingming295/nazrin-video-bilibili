import axios from 'axios';

export let tempData = {};
export class BilibiliSearch
{
    thisPlatform: string;
    SESSDATA: string;
    buvid3: string;
    biliBiliPlatform: 'pc' | 'html5';
    biliBiliqn: number;
    constructor(thisPlatform: string, SESSDATA: string, buvid3: string)
    {
        this.thisPlatform = thisPlatform;
        this.SESSDATA = SESSDATA;
        this.buvid3 = buvid3;
        this.biliBiliPlatform = 'pc';
        this.biliBiliqn = 112
    }
    public async search(keyword: string)
    {
        let result:any;
        const data = await this.getBilibiliVideoSearchData(keyword);
        if (!data){
            return this.returnErr();
        }
        if(!data.result[11]){
            if(!data.result[10]) return this.returnErr();
            result = data.result[10].data;
        } else {
            result = data.result[11].data;
        }

        

        const avid: number[] = {} = result.map((item: { aid: number; }) =>
        {
            const avid = item.aid;

            return avid;
        });

        let promises = avid.map(async avid =>
        {
            return await this.getBilibiliVideoDataByAid(avid);
        });

        const videoData = await Promise.all(promises);

        promises = videoData.filter(video => video !== null).map(async videoData =>
        {
            let backObj = {
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

        const findList = await Promise.all(promises);

        if (!findList) this.returnErr();

        return findList;


    }
    public async returnVideoResource(data: any, qn: number)
    {
        this.biliBiliqn = qn
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

        let videoStream = await this.getBilibiliVideoStream(avid, bvid, cid);

        while (await this.checkResponseStatus(videoStream.durl[0].url) === false)
        {
            this.biliBiliPlatform = 'html5';
            if (this.biliBiliPlatform === 'html5')
            {
                this.changeBilibiliQn();
            }
            videoStream = await this.getBilibiliVideoStream(avid, bvid, cid);
            if (this.biliBiliqn === 6) break;
        }
        const url = videoStream.durl[0].url

        const bitrate = this.getQuality(videoStream.quality)

        return this.returnCompleteVideoResource(url, name, author, cover, duration, bitrate, color)


    }
    private returnErr()
    {
        let findList = [
            {
                err: true,
                platform: this.thisPlatform
            }
        ];

        return findList;

    }

    private getDurationByCid(pages: any[], cid: any)
    {
        const page = pages.find((page: { cid: any; }) => page.cid === cid);
        return page ? page.duration : null;
    }

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

    private async getBilibiliVideoSearchData(keyWord: string)
    {
        const url = 'https://api.bilibili.com/x/web-interface/wbi/search/all/v2';
        const params = {
            keyword: keyWord
        };
        const headers = await {
            Cookie: `SESSDATA=${this.SESSDATA};buvid3=${this.buvid3};`,  // 你的SESSDATA
        };

        try
        {
            const response = await axios.get(url, { params, headers });
            return response.data.data;
        } catch (error: any)
        {
            console.error('Error:', error.response.data.code);
            return null;
        }

    }

    private async getBilibiliVideoDataByAid(aid: number)
    {
        const url = 'https://api.bilibili.com/x/web-interface/view';
        const params = {
            aid: aid
        };
        const headers = await {
            Cookie: `SESSDATA=${this.SESSDATA};`,  // 你的SESSDATA
        };

        try
        {

            const response = await axios.get(url, { params, headers });
            if (response.data.code === 0)
            {
                return response.data.data;
            } else
            {
                return null;
            }

        } catch (error: any)
        {
            console.error('Error:', error.response.data.code);
            return null;
        }

    }

    /**
     * 主要获取视频的url
     * @param avid bilibili avid
     * @param bvid bilibili bvid
     * @param cid bilibili cid
     * @returns 
     */
    private async getBilibiliVideoStream(avid: string, bvid: string, cid: string)
    {
        const url = 'https://api.bilibili.com/x/player/wbi/playurl';
        const params = {
            bvid: bvid,
            avid: avid,
            cid: cid,
            qn: this.biliBiliqn,
            fnval: 1 | 128,
            fourk: 1,
            platform: this.biliBiliPlatform,
            high_quality: 1
        };
        const headers = await {
            Cookie: `SESSDATA=${this.SESSDATA};`,  // 你的SESSDATA
            Referer: 'https://www.bilibili.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
        };

        try
        {
            const response = await axios.get(url, { params, headers });
            if (response.data.code === 0)
            {
                return response.data.data;
            } else
            {
                console.error('Error:', response.data.message);
            }
        } catch (error: any)
        {
            console.error('Error:', error.message);
        }
    }

    /**
     * 根据qn获取quality
     * @param qn bilibili qn 
     * @returns 
     */
    private getQuality(qn: any)
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
        console.log(`platform: ${this.biliBiliPlatform} qn: ${this.biliBiliqn}`)
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
        } catch (error: any)
        {
            return false;
        }
    }

    /**
     * 更换bilibiliQn
     */
    private changeBilibiliQn()
    {
        switch (this.biliBiliqn)
        {
            case 127: // 8k
                this.biliBiliqn = 126;
                break;
            case 126: // 杜比视界
                this.biliBiliqn = 125;
                break;
            case 125: // HDR 真彩色
                this.biliBiliqn = 120;
                break;
            case 120: // 4k
                this.biliBiliqn = 116;
                break;
            case 116: // 1080p60帧
                this.biliBiliqn = 112;
                break;
            case 112: // 1080p高码率
                this.biliBiliqn = 80;
                break;
            case 80:
                this.biliBiliqn = 74;
                break;
            case 74: // 720p60帧
                this.biliBiliqn = 64;
                break;
            case 64:
                this.biliBiliqn = 16;
                break;
            case 16: // 未登录的默认值
                this.biliBiliqn = 6;
                break;
            case 6: //仅 MP4 格式支持, 仅platform=html5时有效
                break;
        }
    }
}