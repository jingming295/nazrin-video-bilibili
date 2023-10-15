/**
 * 使用 https://api.bilibili.com/x/web-interface/wbi/search/all/v2 的时候返回的接口
 */
interface BVideoSearchResponseData
{
    code: number;
    message: string;
    ttl: number;
    data: {
        seid: string;
        page: number;
        pagesize: number;
        numResults: number;
        numPages: number;
        suggest_keyword: string;
        rqt_type: string;
        cost_time: {
            total: string;
            params_check: string;
            is_risk_query: string;
            illegal_handler: string;
            main_handler: string;
            'get upuser live status': string;
            mysql_request: string;
            as_request_format: string;
            as_request: string;
            deserialize_response: string;
            as_response_format: string;
        };
        exp_list: Record<string, boolean>;
        egg_hit: number;
        pageinfo: PageInfo;
        top_tlist: Record<string, number>;
        show_column: number;
        show_module_list: string[];
        app_display_option: {
            is_search_page_grayed: number;
        };
        in_black_key: number;
        in_white_key: number;
        result: VideoSearchResponseDataDataResult[];
        is_search_page_grayed: number;
    };
}

/**
* ResponseDataDataResult data 结果为视频
*/
interface video
{
    /** 固定为video */
    type: string;
    /** 为稿件avid */
    id: number;
    /** UP主昵称 */
    author: string;
    /** UP主mid */
    mid: number;
    /** 视频分区tid */
    typeid: string;
    /** 视频子分区名 */
    typename: string;
    /** 视频重定向url */
    arcurl: string;
    /** 稿件avid */
    aid: number;
    /** 稿件bvid */
    bvid: string;
    /** 视频标题 */
    title: string;
    /** 视频简介 */
    description: string;
    /** '0', 作用尚不明确 */
    arcrank: string;
    /** 视频封面url */
    pic: string;
    /** 视频播放量 */
    play: number;
    /** 视频弹幕量 */
    video_review: number;
    /** 视频收藏数 */
    favorites: number;
    /** 视频TAG */
    tag: string;
    /** 视频评论数 */
    review: number;
    /** 视频投稿时间 */
    pubdate: number;
    /** 视频发布时间 */
    senddate: number;
    /** 视频时长 */
    duration: string;
    /** false，作用尚不明确 */
    badgepay: boolean;
    /** 关键字匹配类型 */
    hit_columns: string[];
    /** 作用尚不明确 */
    view_type: string;
    /** 作用尚不明确 */
    is_pay: number;
    /** 是否为合作视频 */
    is_union_video: number;
    /** 作用尚不明确 */
    rec_tags: null;
    /** 作用尚不明确 */
    new_rec_tags: null[];
    /** 结果排序量化值 */
    rank_score: number;
    /** 获赞数 */
    like: number;
    /** 用户头像url */
    upic: string;
    /** 角标有无 */
    corner: string;
    /** 封面图 */
    cover: string;
    /** 作用尚不明确 */
    desc: string;
    /** 作用尚不明确 */
    url: string;
    /** 作用尚不明确 */
    rec_reason: string;
    /** 弹幕数量？ */
    danmaku: number;
    /** 作用尚不明确 */
    biz_data: null;
    /** 作用尚不明确 */
    is_charge_video: number;
    /** 作用尚不明确 */
    vt: number;
    /** 作用尚不明确 */
    enable_vt: number;
    /** 作用尚不明确 */
    vt_display: string;
    /** 作用尚不明确 */
    subtitle: string;
    /** 作用尚不明确 */
    episode_count_text: string;
    /** 作用尚不明确 */
    release_status: number;
    /** 作用尚不明确 */
    is_intervene: number;
}

/**
 * 作用不明确
 */
interface Expand
{
    is_power_up: boolean;
    system_notice: null | string; // 这里假设 system_notice 可能是 null 或者字符串类型
}

/**
 * 关键字匹配类型
 */
interface HitColumn
{
    [index: number]: string;
}

/**
 * 用户认证信息
 */
interface OfficialVerify
{
    type: number;
    desc: string;
}

/**
 * 用户投稿内容
 */
interface resItem
{
    aid: number;
    bvid: string;
    title: string;
    pubdate: number;
    arcurl: string;
    pic: string;
    play: string;
    dm: number;
    coin: number;
    fav: number;
    desc: string;
    duration: string;
    is_pay: number;
    is_union_video: number;
    is_charge_video: number;
    vt: number;
    enable_vt: number;
    vt_display: string;
}

/**
 * ResponseDataDataResult data 结果为用户
 */
interface bili_userData
{
    type: string;
    mid: number;
    uname: string;
    usign: string;
    fans: number;
    videos: number;
    upic: string;
    face_nft: number;
    face_nft_type: number;
    verify_info: string;
    level: number;
    gender: number;
    is_upuser: number;
    is_live: number;
    room_id: number;
    res: resItem[];
    official_verify: OfficialVerify;
    hit_columns: HitColumn[];
    is_senior_member: number;
    expand: Expand;
}

/**
 * VideoSearchResponseData下的result
 */
interface VideoSearchResponseDataDataResult
{
    result_type: string,
    data: bili_userData[] | video[] | [];
}

/**
 * 页面的信息？
 */
interface PageInfo
{
    video: {
        total: number;
        numResults: number;
        pages: number;
    };
    bangumi: {
        total: number;
        numResults: number;
        pages: number;
    };
    special: {
        total: number;
        numResults: number;
        pages: number;
    };
    topic: {
        total: number;
        numResults: number;
        pages: number;
    };
    upuser: {
        total: number;
        numResults: number;
        pages: number;
    };
    tv: {
        total: number;
        numResults: number;
        pages: number;
    };
    movie: {
        total: number;
        numResults: number;
        pages: number;
    };
    media_bangumi: {
        total: number;
        numResults: number;
        pages: number;
    };
    media_ft: {
        total: number;
        numResults: number;
        pages: number;
    };
    related_search: {
        total: number;
        numResults: number;
        pages: number;
    };
    user: {
        total: number;
        numResults: number;
        pages: number;
    };
    activity: {
        total: number;
        numResults: number;
        pages: number;
    };
    operation_card: {
        total: number;
        numResults: number;
        pages: number;
    };
    pgc: {
        total: number;
        numResults: number;
        pages: number;
    };
    live: {
        total: number;
        numResults: number;
        pages: number;
    };
    live_all: {
        total: number;
        numResults: number;
        pages: number;
    };
    live_user: {
        total: number;
        numResults: number;
        pages: number;
    };
    bili_user: {
        total: number;
        numResults: number;
        pages: number;
    };
    live_room: {
        total: number;
        numResults: number;
        pages: number;
    };
    article: {
        total: number;
        numResults: number;
        pages: number;
    };
    live_master: {
        total: number;
        numResults: number;
        pages: number;
    };
}