import axios from 'axios';
import { json } from 'stream/consumers';
export class BilibiliSearch {
    public async search(keyword: string, SESSDATA:string, buvid3:string) {
        let bvid: string [] = []
        let signer: string [] = []
        let cover: string [] = []

        const data = await this.getBilibiliVideoData(keyword, SESSDATA, buvid3)
        if(!data && !data.result[11].data[0]) return
        
        data.result[11].data.forEach((item: any) => {
            console.log(item);
          });
          

        
    }


    private async getBilibiliVideoData(keyWord:string, SESSDATA: string, buvid3:string)
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
            return response.data.data;
        } catch (error: any)
        {
            console.error('Error:', error.response.data.code);
        }

    }
}