import { execSync } from 'child_process';

const phpBin = process.env.PHP_PATH || 'php';

let isPhpAvailable = false;
let phpVersion = null;

try {
    const output = execSync(`${phpBin} -v`, { encoding: 'utf-8', timeout: 5000 });
    const match = output.match(/PHP\s+([\d.]+)/);
    if (match) {
        isPhpAvailable = true;
        phpVersion = match[1];
    }
} catch (e) {
    console.log(`[phpEnv] PHP 不可用 (${phpBin}): ${e.message}`);
}

export { isPhpAvailable, phpVersion };
