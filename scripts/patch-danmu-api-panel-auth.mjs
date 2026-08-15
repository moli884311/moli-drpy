import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const mainJs = path.join(root, 'libs_drpy', 'danmu_api', 'danmu_api', 'ui', 'js', 'main.js');
const sysJs = path.join(root, 'libs_drpy', 'danmu_api', 'danmu_api', 'ui', 'js', 'systemsettings.js');

function apply(file, replacements) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = 0;
  for (const [from, to] of replacements) {
    if (content.includes(to)) {
      continue;
    }
    if (!content.includes(from)) {
      console.warn(`[panel-auth] 未找到锚点，跳过：${from.slice(0, 40)}...`);
      continue;
    }
    content = content.replace(from, to);
    changed++;
  }
  fs.writeFileSync(file, content, 'utf8');
  return changed;
}

let total = 0;

total += apply(mainJs, [
  [
    `let originalToken = '';`,
    `let originalToken = '';\nlet adminAuthed = false; // 是否已通过 pwd/路径 token 鉴权为管理员`,
  ],
  [
    `async function init() {\n    try {\n        await updateApiEndpoint(); // 等待API端点更新完成`,
    `async function init() {\n    try {\n        // 支持从首页跳转携带 ?pwd= 参数：先将其作为 admin token 尝试获取配置，\n        // 后端会校验 pwd 是否为 api_pwd，通过后 config 返回真实 ADMIN_TOKEN。\n        const panelPwd = new URLSearchParams(window.location.search).get('pwd');\n        if (panelPwd) {\n            currentAdminToken = panelPwd;\n        }\n        await updateApiEndpoint(); // 等待API端点更新完成`,
  ],
  [
    `        if (section === 'env') {\n            // 检查部署平台配置\n            checkDeployPlatformConfig().then(result => {`,
    `        if (section === 'env') {\n            // 未通过 pwd/路径 token 鉴权时，提示输入面板访问密码\n            if (!checkAdminToken()) {\n                setTimeout(() => {\n                    promptPanelPwd();\n                }, 100);\n                return;\n            }\n            // 检查部署平台配置\n            checkDeployPlatformConfig().then(result => {`,
  ],
]);

total += apply(sysJs, [
  [
    `function checkAdminToken() {\n    let _reverseProxy = customBaseUrl; // 使用全局变量 customBaseUrl`,
    `function checkAdminToken() {\n    // 已通过 ?pwd= 参数（api_pwd）鉴权成功\n    if (adminAuthed) {\n        return true;\n    }\n\n    let _reverseProxy = customBaseUrl; // 使用全局变量 customBaseUrl`,
  ],
  [
    `    const hasAdminToken = config.hasAdminToken;\n    currentAdminToken = config.originalEnvVars?.ADMIN_TOKEN || '';\n    return config;`,
    `    const hasAdminToken = config.hasAdminToken;\n    const rawAdminToken = config.originalEnvVars?.ADMIN_TOKEN || '';\n    currentAdminToken = rawAdminToken;\n    // 真实 ADMIN_TOKEN（非空、非脱敏星号）才视为已鉴权（pwd 校验通过或路径 token 正确）\n    adminAuthed = rawAdminToken !== '' && rawAdminToken !== '*'.repeat(rawAdminToken.length);\n    return config;`,
  ],
  [
    `            envNavBtn.title = '请先配置ADMIN_TOKEN并使用正确的admin token访问以启用系统管理功能';`,
    `            envNavBtn.title = '请先输入面板访问密码（api_pwd）以启用系统管理功能';`,
  ],
  [
    `// 获取配置项类型的显示标签\nfunction getEnvTypeLabel(type) {`,
    `// 提示用户输入面板访问密码（api_pwd），输入后携带 ?pwd= 跳转重新鉴权\nfunction promptPanelPwd() {\n    const pwd = window.prompt('请输入面板访问密码（api_pwd）：');\n    if (pwd) {\n        const url = new URL(window.location.href);\n        url.searchParams.set('pwd', pwd.trim());\n        window.location.href = url.toString();\n    }\n}\n\n// 获取配置项类型的显示标签\nfunction getEnvTypeLabel(type) {`,
  ],
]);

console.log(`[panel-auth] 面板 api_pwd 鉴权定制已应用，共 ${total} 处`);
