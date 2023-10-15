import axios from 'axios';
import { Logger } from 'koishi';
export class BiliBiliApi
{
    public async getBilibiliVideoSearchData(keyWord: string, SESSDATA: string, buvid3: string, logger: Logger)
    {
        const url = 'https://api.bilibili.com/x/web-interface/wbi/search/all/v2';
        const params = {
            keyword: keyWord
        };
        const headers = await {
            Cookie: `SESSDATA=${SESSDATA};buvid3=${buvid3};`,  // 你的SESSDATA
        };

        try
        {
            const response = await axios.get(url, { params, headers });
            const responseData: BVideoSearchResponseData = response.data;
            if (responseData.code === 0)
            {
                return responseData.data;
            }
            return null;
        } catch (error)
        {
            logger.error('Error:', error);
            return null;
        }

    }

    public async getBilibiliVideoDetailByAid(aid: number, SESSDATA: string, logger: Logger)
    {
        const url = 'https://api.bilibili.com/x/web-interface/view';
        const params = {
            aid: aid
        };
        const headers = await {
            Cookie: `SESSDATA=${SESSDATA};`,  // 你的SESSDATA
        };

        try
        {

            const response = await axios.get(url, { params, headers });

            const responseData: BVideoDetail = response.data;

            if (response.data.code === 0)
            {
                return responseData.data;
            } else
            {
                return null;
            }

        } catch (error)
        {
            logger.error('Error:', error);
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
    public async getBilibiliVideoStream(avid: number, bvid: string, cid: number, SESSDATA: string, biliBiliPlatform: string, biliBiliqn: number, logger: Logger)
    {
        const url = 'https://api.bilibili.com/x/player/wbi/playurl';
        const params = {
            bvid: bvid,
            avid: avid,
            cid: cid,
            qn: biliBiliqn,
            fnval: 1 | 128,
            fourk: 1,
            platform: biliBiliPlatform,
            high_quality: 1
        };
        const headers = await {
            Cookie: `SESSDATA=${SESSDATA};`,  // 你的SESSDATA
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
                logger.error('Error:', response.data.message);
            }
        } catch (error)
        {
            logger.error('Error:', error);
        }
    }
}