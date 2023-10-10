import axios from 'axios';

export let tempData = {}
export class BilibiliSearch
{
    thisPlatform: string;
    SESSDATA:string
    buvid3: string
    constructor(thisPlatform: string, SESSDATA:string, buvid3: string)
    {
        this.thisPlatform = thisPlatform;
        this.SESSDATA = SESSDATA
        this.buvid3 = buvid3
    }
    public async search(keyword: string)
    {
        const data = await this.getBilibiliVideoSearchData(keyword);
        if (!data && !data.result[11].data[0]) return this.returnErr()
        const result = data.result[11].data;

        const avid: number[] = {} = result.map((item: { aid: number; }) =>
        {
            const avid = item.aid;

            return avid;
        });

        let promises = avid.map(async avid => {
            return await this.getBilibiliVideoDataByAid(avid)
          });

        const videoData = await Promise.all(promises);

        promises = videoData.filter(video => video !== null).map(async videoData => {
            if(!videoData) return null

            let backObj = {
                name: videoData.title || '无法获取',
                author: videoData.owner.name || '无法获取',
                cover: videoData.pic || '无法获取',
                url: null,
                platform: this.thisPlatform,
                err: false,
                data:videoData
              };
        
              return backObj;
        })
        
        const findList = await Promise.all(promises);

        if(!findList) this.returnErr()

        return findList


    }

    public async returnVideo() {

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
            return null
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
            if(response.data.code === 0) {
                return response.data.data;
            } else {
                return null
            }
            
        } catch (error: any)
        {
            console.error('Error:', error.response.data.code);
            return null
        }

    }
}