import path from 'path';
import fs from '../../utils/fsWrapper.js';
import { PROJECT_ROOT } from '../../utils/pathHelper.js';
import { ENV } from '../../utils/env.js';
import { formatSiteName } from '../config.js';

const CUSTOM_JSON_PATH = path.join(PROJECT_ROOT, 'public/sub/custom/moli.json');
const SPIDER_DIR = path.join(PROJECT_ROOT, 'spider');

function extractHeaderMeta(content) {
    const headerMatch = content.match(/@header\(\s*\{([^}]+)\}\s*\)/s);
    if (!headerMatch) return {};

    const headerStr = headerMatch[1];
    const meta = {};

    const titleMatch = headerStr.match(/title:\s*['"]([^'"]+)['"]/);
    if (titleMatch) meta.title = titleMatch[1];

    const searchableMatch = headerStr.match(/searchable:\s*(\d+)/);
    if (searchableMatch) meta.searchable = parseInt(searchableMatch[1]);

    const filterableMatch = headerStr.match(/filterable:\s*(\d+)/);
    if (filterableMatch) meta.filterable = parseInt(filterableMatch[1]);

    const quickSearchMatch = headerStr.match(/quickSearch:\s*(\d+)/);
    if (quickSearchMatch) meta.quickSearch = parseInt(quickSearchMatch[1]);

    const langMatch = headerStr.match(/lang:\s*['"]([^'"]+)['"]/);
    if (langMatch) meta.lang = langMatch[1];

    return meta;
}

function getTypeCode(sourceType, lang) {
    if (sourceType === 'js') {
        if (lang === 'dr2') return 3;
        return 4;
    }
    if (sourceType === 'py') return 4;
    if (sourceType === 'php') return 5;
    if (sourceType === 'catvod') return 5;
    return 4;
}

function buildSiteEntry(basename, sourceType, meta, requestHost) {
    const title = meta.title || basename.replace(/\.[^.]+$/, '');

    const key = sourceType === 'js'
        ? `drpy2_${title}`
        : (sourceType === 'py' ? `drpyS_${title}` : `drpy_${title}`);

    const brandName = ENV.get('brand_name', '沫离影视');
    const name = formatSiteName(title, brandName);

    const type = getTypeCode(sourceType, meta.lang);
    const lang = meta.lang || (sourceType === 'js' ? 'ds' : (sourceType === 'py' ? 'ds' : ''));

    const entry = {
        key,
        name,
        type,
        searchable: meta.searchable !== undefined ? meta.searchable : 2,
        filterable: meta.filterable !== undefined ? meta.filterable : 1,
        quickSearch: meta.quickSearch !== undefined ? meta.quickSearch : 0,
        title,
        lang,
    };

    if (type === 3) {
        entry.api = `http://${requestHost}/public/drpy/drpy2.min.js`;
        entry.ext = `http://${requestHost}/js/${encodeURIComponent(basename)}?pwd=moli`;
    } else if (type === 4) {
        entry.api = `http://${requestHost}/api/${encodeURIComponent(basename)}?pwd=moli`;
    } else {
        entry.api = `http://${requestHost}/public/drpy/drpy3.min.js`;
        entry.ext = `http://${requestHost}/js/${encodeURIComponent(basename)}?pwd=moli`;
    }

    entry.ext = entry.ext || '';
    return entry;
}

export const getCustomSources = async (request, reply) => {
    try {
        if (!await fs.pathExists(CUSTOM_JSON_PATH)) {
            return reply.send({ success: true, data: { sites: [], lives: [] } });
        }
        const content = await fs.readFile(CUSTOM_JSON_PATH, 'utf-8');
        const data = JSON.parse(content);
        return reply.send({
            success: true,
            data: {
                sites: data.sites || [],
                lives: data.lives || []
            }
        });
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ success: false, message: error.message });
    }
};

export const addCustomSource = async (request, reply) => {
    try {
        const { name: sourceFile, type: sourceType } = request.body;

        if (!sourceFile || !sourceType) {
            return reply.code(400).send({ success: false, message: '缺少 source_name 或 source_type' });
        }

        const fullPath = path.join(SPIDER_DIR, sourceType, sourceFile);
        if (!await fs.pathExists(fullPath)) {
            return reply.code(404).send({ success: false, message: `源文件不存在: ${fullPath}` });
        }

        const content = await fs.readFile(fullPath, 'utf-8');
        const meta = extractHeaderMeta(content);

        const requestHost = request.headers.host || 'localhost';
        const entry = buildSiteEntry(sourceFile, sourceType, meta, requestHost);

        let customData = { sites: [], lives: [] };
        if (await fs.pathExists(CUSTOM_JSON_PATH)) {
            const existing = await fs.readFile(CUSTOM_JSON_PATH, 'utf-8');
            try {
                customData = JSON.parse(existing);
            } catch (e) {
                customData = { sites: [], lives: [] };
            }
        }

        if (!customData.sites) customData.sites = [];
        if (!customData.lives) customData.lives = [];

        if (customData.sites.find(s => s.key === entry.key)) {
            return reply.send({ success: false, message: `源 "${entry.title}" 已在自定义列表中` });
        }

        customData.sites.push(entry);
        await fs.writeFile(CUSTOM_JSON_PATH, JSON.stringify(customData, null, 2));

        return reply.send({ success: true, message: `已添加 "${entry.title}" 到自定义源` });
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ success: false, message: error.message });
    }
};

export const removeCustomSource = async (request, reply) => {
    try {
        const { name: sourceFile } = request.body;

        if (!sourceFile) {
            return reply.code(400).send({ success: false, message: '缺少 source_name' });
        }

        const basename = sourceFile.replace(/\.[^.]+$/, '');

        if (!await fs.pathExists(CUSTOM_JSON_PATH)) {
            return reply.send({ success: false, message: '自定义源列表为空' });
        }

        const content = await fs.readFile(CUSTOM_JSON_PATH, 'utf-8');
        const customData = JSON.parse(content);

        if (!customData.sites) {
            return reply.send({ success: false, message: '自定义源列表为空' });
        }

        const initialLength = customData.sites.length;
        customData.sites = customData.sites.filter(s => {
            const siteKey = s.title || s.key || '';
            return !siteKey.includes(basename);
        });

        if (customData.sites.length === initialLength) {
            return reply.send({ success: false, message: `未找到匹配 "${basename}" 的自定义源` });
        }

        await fs.writeFile(CUSTOM_JSON_PATH, JSON.stringify(customData, null, 2));

        return reply.send({ success: true, message: `已从自定义源移除 "${basename}"` });
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ success: false, message: error.message });
    }
};
