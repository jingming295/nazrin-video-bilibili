interface VideoResource
{
    url: string;
    name: string;
    author: string;
    cover: string;
    duration: number;
    bitRate: number;
    color: string;
    error: string | null;
}

interface VideoSerachData
{
    type: string;// 固定为video
    id: number;// 	为稿件avid
    author: string;// UP主昵称
    mid: number;// UP主mid
    typeid: string;// 视频分区tid
    typename: string;// 视频子分区名
    arcurl: string;// 视频重定向url
    aid: number;// 稿件avid
    bvid: string;// 稿件bvid
    title: string;// 视频标题
    description: string;// 视频简介
    arcrank: string;// '0', 作用尚不明确
    pic: string;// 视频封面url
    play: number;// 视频播放量
    video_review: number;
    favorites: number;
    tag: string;
    review: number;
    pubdate: number;
    senddate: number;
    duration: string;
    badgepay: boolean;
    hit_columns: string[];
    view_type: string;
    is_pay: number;
    is_union_video: number;
    rec_tags: null;
    new_rec_tags: null[];
    rank_score: number;
    like: number;
    upic: string;
    corner: string;
    cover: string;
    desc: string;
    url: string;
    rec_reason: string;
    danmaku: number;
    biz_data: null;
    is_charge_video: number;
    vt: number;
    enable_vt: number;
    vt_display: string;
    subtitle: string;
    episode_count_text: string;
    release_status: number;
    is_intervene: number;
}