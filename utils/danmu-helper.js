// danmu-helper.js: 弹幕数量辅助模块
/**
 * 功能说明：
 * 1. 根据视频名称查询弹幕总数（外部弹幕服务 danmu_api2）
 * 2. 为视频对象追加弹幕数量提示（不覆盖原有 vod_remarks / notice 内容）
 * 3. 递归遍历响应数据，统一增强所有视频项
 * 4. 内置 Map 缓存（默认 10 分钟）、并发限制、超时与优雅降级
 */
import createAxiosInstance from './createAxiosAgent.js';

// ── 配置项（支持环境变量覆盖，未配置时使用默认值） ──
const DANMU_API_BASE = (process.env.DANMU_API_BASE || 'http://8.130.134.173:9321').replace(/\/+$/, '');
const DANMU_TIMEOUT = Number(process.env.DANMU_TIMEOUT || 5000);                    // 单次请求超时（毫秒），默认5秒
const DANMU_CACHE_TTL = Number(process.env.DANMU_CACHE_TTL || 10 * 60 * 1000);      // 缓存有效期（毫秒），默认10分钟
const DANMU_MAX_CONCURRENT = Number(process.env.DANMU_MAX_CONCURRENT || 5);         // 并发查询上限，避免瞬时大量请求
const DANMU_MAX_ITEMS = Number(process.env.DANMU_MAX_ITEMS || 50);                  // 单个响应最多处理的视频项数

// 弹幕提示标记，用于判断字段是否已包含弹幕提示（防止重复追加）
const DANMU_FLAG = '💬';

// axios 实例（复用项目的代理 / DOH 配置）
const _axios = createAxiosInstance({ maxSockets: 32 });

// ── 弹幕数量缓存：Map<视频名称, 弹幕数量> ──
const danmuCountCache = new Map();
// 缓存过期清理定时器：Map<视频名称, timer>
const cacheTimers = new Map();

// ── 并发控制：限制同时进行的外部弹幕查询数量 ──
let activeCount = 0;
const waitingQueue = [];

// 获取并发额度，超过上限则进入等待队列
function acquireSlot() {
    return new Promise((resolve) => {
        if (activeCount < DANMU_MAX_CONCURRENT) {
            activeCount++;
            resolve();
        } else {
            waitingQueue.push(resolve);
        }
    });
}

// 释放并发额度，优先将额度转移给等待队列中的请求
function releaseSlot() {
    const next = waitingQueue.shift();
    if (next) {
        next();
    } else {
        activeCount--;
    }
}

// 为缓存条目设置过期清理定时器，到期自动删除对应缓存
function scheduleCacheExpiry(key) {
    const oldTimer = cacheTimers.get(key);
    if (oldTimer) clearTimeout(oldTimer);
    const timer = setTimeout(() => {
        danmuCountCache.delete(key);
        cacheTimers.delete(key);
    }, DANMU_CACHE_TTL);
    if (timer.unref) timer.unref(); // 不阻止进程退出
    cacheTimers.set(key, timer);
}

/**
 * 调用外部弹幕服务查询弹幕总数
 * 流程：搜索 anime 获取 animeId → 查询 bangumi 详情取 episodes 数组长度
 * @param {string} name 视频名称
 * @returns {Promise<number>} 弹幕总数，任何步骤无结果返回 0
 */
async function queryDanmuCountFromApi(name) {
    // 步骤1：根据关键词搜索剧集，取第一个匹配项的 animeId
    const searchUrl = `${DANMU_API_BASE}/api/v2/search/anime?keyword=${encodeURIComponent(name)}`;
    const searchResp = await _axios.get(searchUrl, {
        timeout: DANMU_TIMEOUT,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        },
    });
    const searchData = searchResp.data;
    const animes = searchData && searchData.animes;
    if (!Array.isArray(animes) || animes.length === 0) {
        console.log(`[danmu-helper] 弹幕服务未匹配到剧集: ${name}`);
        return 0;
    }
    const animeId = animes[0].animeId;
    if (!animeId) return 0;

    // 步骤2：查询剧集详情，episodes 数组长度即弹幕总数
    const bangumiUrl = `${DANMU_API_BASE}/api/v2/bangumi/${animeId}`;
    const bangumiResp = await _axios.get(bangumiUrl, {
        timeout: DANMU_TIMEOUT,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        },
    });
    const bangumiData = bangumiResp.data;
    const episodes = bangumiData && bangumiData.bangumi && bangumiData.bangumi.episodes;
    if (!Array.isArray(episodes)) {
        console.log(`[danmu-helper] 弹幕服务详情无 episodes: ${name}, animeId=${animeId}`);
        return 0;
    }
    return episodes.length;
}

/**
 * 根据视频名称获取弹幕总数（带 10 分钟缓存，超时/失败优雅降级返回 0）
 * @param {string} vodName 视频名称
 * @returns {Promise<number>} 弹幕总数，查询失败返回 0
 */
export async function getDanmuCount(vodName) {
    const name = String(vodName || '').trim();
    if (!name) return 0;

    // 1. 命中缓存直接返回，避免重复请求外部服务
    if (danmuCountCache.has(name)) {
        console.log(`[danmu-helper] 弹幕数量缓存命中: ${name} -> ${danmuCountCache.get(name)}`);
        return danmuCountCache.get(name);
    }

    // 2. 进入并发控制，避免突发大量查询拖慢响应
    await acquireSlot();
    try {
        // 双重检查缓存（排队等待期间可能已有其他请求写入）
        if (danmuCountCache.has(name)) {
            return danmuCountCache.get(name);
        }

        // 3. 查询外部弹幕服务
        const count = await queryDanmuCountFromApi(name);
        danmuCountCache.set(name, count);
        scheduleCacheExpiry(name);
        console.log(`[danmu-helper] 弹幕数量查询完成: ${name} -> ${count}`);
        return count;
    } catch (e) {
        // 4. 任何异常都不影响主流程，记录日志并降级返回 0
        console.error(`[danmu-helper] 查询弹幕数量失败: ${name}, ${e.message}`);
        return 0;
    } finally {
        releaseSlot();
    }
}

/**
 * 为单个视频对象追加弹幕数量提示
 * 优先追加到 vod_remarks，若对象使用 name（而非 vod_name）则追加到 notice
 * 不覆盖原有内容，追加在末尾；原字段为空则直接赋值
 * @param {Object} item 视频对象
 * @returns {Promise<void>}
 */
export async function enrichVideoItem(item) {
    if (!item || typeof item !== 'object') return;

    // 判断视频项类型：以 vod_name 为主，兼容 name 字段
    const hasVodName = typeof item.vod_name === 'string' && item.vod_name.trim() !== '';
    const hasName = typeof item.name === 'string' && item.name.trim() !== '';
    if (!hasVodName && !hasName) return;

    const vodName = hasVodName ? item.vod_name.trim() : item.name.trim();
    // 目标字段：vod_name 对应 vod_remarks，name 对应 notice
    const targetKey = hasVodName ? 'vod_remarks' : 'notice';

    // 若目标字段已包含弹幕提示标记，说明已处理过，跳过防止重复追加
    if (typeof item[targetKey] === 'string' && item[targetKey].includes(DANMU_FLAG)) return;

    // 查询弹幕数量（内部有缓存 + 超时 + 降级，不会抛异常影响主流程）
    const count = await getDanmuCount(vodName);

    // 拼接提示文本：有弹幕时显示匹配数量，否则显示暂无
    const remark = count > 0 ? ` 💬 匹配到 ${count} 条弹幕` : ` 💬 暂无弹幕`;

    // 追加到目标字段末尾，不覆盖原有内容；原字段为空则直接赋值
    if (typeof item[targetKey] === 'string' && item[targetKey].trim() !== '') {
        item[targetKey] = item[targetKey] + remark;
    } else {
        item[targetKey] = remark;
    }
}

// 判断节点是否为视频项：含 vod_name 必为视频项；仅含 name 时需附带视频特征字段，避免误判分类等普通对象
function isVideoItem(node) {
    if (typeof node.vod_name === 'string' && node.vod_name.trim() !== '') return true;
    if (typeof node.name === 'string' && node.name.trim() !== '') {
        const videoHints = ['vod_id', 'vod_pic', 'vod_play_url', 'vod_remarks', 'pic', 'notice', 'remarks'];
        return videoHints.some((k) => node[k] !== undefined && node[k] !== null && node[k] !== '');
    }
    return false;
}

/**
 * 递归遍历响应数据，为所有视频项追加弹幕数量提示
 * 先收集全部视频项，再并行增强（受 getDanmuCount 内部并发控制限制），
 * 避免串行等待导致响应过慢；使用 WeakSet 记录已处理对象，不污染返回数据
 * @param {*} data 响应数据（对象 / 数组 / 基本类型）
 * @param {number} maxItems 单个响应最多处理的视频项数，防止响应过慢
 * @returns {Promise<number>} 实际处理的视频项数量
 */
export async function enrichResponseData(data, maxItems = DANMU_MAX_ITEMS) {
    // 先收集所有视频项
    const videoItems = [];
    const processed = new WeakSet();

    function collect(node) {
        if (videoItems.length >= maxItems) return;
        if (!node || typeof node !== 'object') return;

        // 数组：遍历每个元素
        if (Array.isArray(node)) {
            for (const child of node) {
                if (videoItems.length >= maxItems) return;
                collect(child);
            }
            return;
        }

        // 视频项：加入收集列表后不再深入遍历（视频项内部通常不再嵌套视频项）
        if (isVideoItem(node)) {
            if (!processed.has(node)) {
                processed.add(node);
                videoItems.push(node);
            }
            return;
        }

        // 普通对象：遍历子字段
        for (const key of Object.keys(node)) {
            if (videoItems.length >= maxItems) return;
            collect(node[key]);
        }
    }

    collect(data);

    // 并行增强所有视频项，并发上限由 getDanmuCount 内部控制
    await Promise.all(videoItems.map(async (item) => {
        try {
            await enrichVideoItem(item);
        } catch (e) {
            console.error(`[danmu-helper] 增强视频项失败: ${e.message}`);
        }
    }));

    return videoItems.length;
}
