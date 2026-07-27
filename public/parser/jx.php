<?php
/**
 * 自建视频解析器
 * 用法: /parser/jx.php?url=<视频页面URL>
 *
 * 支持的平台:
 * - 腾讯视频 (v.qq.com)
 * - 爱奇艺 (iqiyi.com)
 * - 优酷 (youku.com)
 * - 芒果TV (mgtv.com)
 * - 搜狐 (sohu.com)
 * - 乐视 (le.com)
 * - B站 (bilibili.com)
 * - 1905 (1905.com)
 * - 其他通用页面自动提取 video/m3u8 源
 */

error_reporting(0);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Content-Type: application/json; charset=utf-8');

$url = isset($_GET['url']) ? trim($_GET['url']) : '';
if (empty($url)) {
    die(json_encode(['code' => 400, 'msg' => '缺少 url 参数']));
}

if (!filter_var($url, FILTER_VALIDATE_URL)) {
    die(json_encode(['code' => 400, 'msg' => '无效的 URL']));
}

$host = parse_url($url, PHP_URL_HOST);

// ============ 公共函数 ============

function http_get($url, $headers = [], $opts = []) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 5,
        CURLOPT_TIMEOUT => $opts['timeout'] ?? 15,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        CURLOPT_ENCODING => 'gzip, deflate',
    ]);

    $cookieFile = sys_get_temp_dir() . '/jx_cookie_' . md5($url);
    if (isset($opts['cookie'])) {
        curl_setopt($ch, CURLOPT_COOKIE, $opts['cookie']);
    } elseif (isset($opts['cookie_file'])) {
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);
    }

    $data = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if (curl_errno($ch) || $httpCode >= 400) {
        curl_close($ch);
        return false;
    }
    curl_close($ch);
    return $data;
}

function extract_video_urls($html) {
    $urls = [];

    // 提取视频源类型(m3u8/mp4/等)
    $patterns = [
        '/["\'](https?:\/\/[^"\'\s]+\.m3u8[^"\'\s]*?)["\']/i',
        '/["\'](https?:\/\/[^"\'\s]+\.mp4[^"\'\s]*?)["\']/i',
        '/["\'](https?:\/\/[^"\'\s]+\.flv[^"\'\s]*?)["\']/i',
        '/["\'](https?:\/\/[^"\'\s]+\.ts[^"\'\s]*?)["\']/i',
        '/url:\s*["\'](https?:\/\/[^"\'\s]+)["\']/i',
        '/src:\s*["\'](https?:\/\/[^"\'\s]+)["\']/i',
        '/video_url:\s*["\'](https?:\/\/[^"\'\s]+)["\']/i',
    ];

    foreach ($patterns as $pattern) {
        if (preg_match_all($pattern, $html, $matches)) {
            foreach ($matches[1] as $u) {
                $u = trim($u);
                if (!in_array($u, $urls) && filter_var($u, FILTER_VALIDATE_URL)) {
                    $urls[] = $u;
                }
            }
        }
    }

    // 按画质排序 (含数字的排前面，比如 1080p)
    usort($urls, function($a, $b) {
        preg_match('/(\d+)p?/i', $a, $ma);
        preg_match('/(\d+)p?/i', $b, $mb);
        $qa = isset($ma[1]) ? (int)$ma[1] : 0;
        $qb = isset($mb[1]) ? (int)$mb[1] : 0;
        return $qb - $qa;
    });

    return $urls;
}

// ============ 平台特定解析 ============

function parse_tencent($url) {
    $html = http_get($url, [
        'Referer: https://v.qq.com/',
    ]);
    if (!$html) return [];

    $urls = [];

    // 腾讯视频嵌入的播放器信息
    if (preg_match('/"videoInfo":\s*({.+?}),\s*"previewInfo"/s', $html, $m)) {
        $info = json_decode($m[1], true);
        // 尝试从 player 配置中提取
    }

    // 通用提取
    $urls = array_merge($urls, extract_video_urls($html));
    return $urls;
}

function parse_iqiyi($url) {
    $vid = '';
    if (preg_match('/v_(\w+)\.html/', $url, $m)) {
        $vid = $m[1];
    } elseif (preg_match('/vid=(\w+)/', $url, $m)) {
        $vid = $m[1];
    }

    $html = http_get($url, [
        'Referer: https://www.iqiyi.com/',
    ]);
    if (!$html) return [];

    $urls = extract_video_urls($html);
    return $urls;
}

function parse_youku($url) {
    $html = http_get($url, [
        'Referer: https://v.youku.com/',
    ]);
    if (!$html) return [];
    return extract_video_urls($html);
}

function parse_mgtv($url) {
    $html = http_get($url, [
        'Referer: https://www.mgtv.com/',
    ]);
    if (!$html) return [];
    return extract_video_urls($html);
}

function parse_sohu($url) {
    $html = http_get($url, [
        'Referer: https://tv.sohu.com/',
    ]);
    if (!$html) return [];
    return extract_video_urls($html);
}

function parse_letv($url) {
    $html = http_get($url, [
        'Referer: https://www.le.com/',
    ]);
    if (!$html) return [];
    return extract_video_urls($html);
}

function parse_bilibili($url) {
    // B站需要 API 获取视频地址
    if (preg_match('/BV(\w+)/', $url, $m)) {
        $bvid = 'BV' . $m[1];
        $apiUrl = "https://api.bilibili.com/x/player/playurl?bvid={$bvid}&cid=0&qn=80&fnval=4048&fourk=1";
        $resp = http_get($apiUrl, [
            'Referer: https://www.bilibili.com/',
            'Origin: https://www.bilibili.com',
        ]);
        if ($resp) {
            $data = json_decode($resp, true);
            $urls = [];
            if (isset($data['data']['durl'])) {
                foreach ($data['data']['durl'] as $d) {
                    if (isset($d['url'])) $urls[] = $d['url'];
                }
            }
            if (isset($data['data']['dash'])) {
                foreach (['video', 'audio'] as $type) {
                    if (isset($data['data']['dash'][$type])) {
                        foreach ($data['data']['dash'][$type] as $d) {
                            if (isset($d['baseUrl'])) $urls[] = $d['baseUrl'];
                            if (isset($d['base_url'])) $urls[] = $d['base_url'];
                        }
                    }
                }
            }
            if (!empty($urls)) return $urls;
        }
    }

    $html = http_get($url, [
        'Referer: https://www.bilibili.com/',
    ]);
    if (!$html) return [];
    return extract_video_urls($html);
}

// ============ 主逻辑 ============

$urls = [];
$platform = '未知平台';

if (strpos($host, 'qq.com') !== false || strpos($host, 'video.qq.com') !== false) {
    $platform = '腾讯视频';
    $urls = parse_tencent($url);
} elseif (strpos($host, 'iqiyi.com') !== false) {
    $platform = '爱奇艺';
    $urls = parse_iqiyi($url);
} elseif (strpos($host, 'youku.com') !== false) {
    $platform = '优酷';
    $urls = parse_youku($url);
} elseif (strpos($host, 'mgtv.com') !== false || strpos($host, 'imgo.tv') !== false) {
    $platform = '芒果TV';
    $urls = parse_mgtv($url);
} elseif (strpos($host, 'sohu.com') !== false) {
    $platform = '搜狐';
    $urls = parse_sohu($url);
} elseif (strpos($host, 'le.com') !== false) {
    $platform = '乐视';
    $urls = parse_letv($url);
} elseif (strpos($host, 'bilibili.com') !== false) {
    $platform = '哔哩哔哩';
    $urls = parse_bilibili($url);
} elseif (strpos($host, '1905.com') !== false) {
    $platform = '1905电影网';
    $html = http_get($url, ['Referer: https://www.1905.com/']);
    if ($html) $urls = extract_video_urls($html);
} else {
    // 通用解析：直接请求页面提取所有视频 URL
    $html = http_get($url);
    if ($html) $urls = extract_video_urls($html);
}

// 返回结果
echo json_encode([
    'code' => !empty($urls) ? 200 : 404,
    'msg' => !empty($urls) ? '解析成功' : '未找到可播放的视频源',
    'platform' => $platform,
    'url' => !empty($urls) ? $urls[0] : '',
    'urls' => $urls,
    'total' => count($urls),
    'time' => date('Y-m-d H:i:s'),
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
