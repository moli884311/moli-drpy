import path from 'path';
import {readFileSync, existsSync, createReadStream} from 'fs';
import '../utils/marked.min.js';
import {validateBasicAuth} from "../utils/api_validate.js";
import {daemon} from "../utils/daemonManager.js";
import {toBeijingTime} from "../utils/datetime-format.js"
import {ENV} from '../utils/env.js';

export default (fastify, options, done) => {
    fastify.get('/', async (request, reply) => {
        const indexHtmlPath = path.join(options.rootDir, 'public/index.html');

        if (existsSync(indexHtmlPath)) {
            let indexHtml = readFileSync(indexHtmlPath, 'utf-8');
            const apiPwd = ENV.get('api_pwd', process.env.API_PWD || 'dzyyds');
            if (apiPwd) {
                indexHtml = indexHtml.replaceAll('$pwd', apiPwd);
            } else {
                indexHtml = indexHtml.replace(/[?&]pwd=\$pwd/g, '');
            }
            reply.type('text/html;charset=utf-8').send(indexHtml);
        } else {
            reply.code(404).type('text/html;charset=utf-8').send('<h1>index.html not found</h1>');
        }
    });

    fastify.get('/robots.txt', (request, reply) => {
        const filePath = path.join(options.rootDir, 'public', 'robots.txt');
        const fileStream = createReadStream(filePath);
        reply.type('text/plain;charset=utf-8').send(fileStream);
    });

    fastify.get('/favicon.ico', async (request, reply) => {
        try {
            const faviconPath = path.join(options.rootDir, 'public', 'favicon.ico');
            if (existsSync(faviconPath)) {
                const fileStream = createReadStream(faviconPath);
                return reply.type('image/x-icon').send(fileStream);
            } else {
                reply.status(404).send({error: 'Favicon not found'});
            }
        } catch (error) {
            reply.status(500).send({error: 'Failed to fetch favicon', details: error.message});
        }
    });

    fastify.get('/cat/index.html', {preHandler: validateBasicAuth}, async (request, reply) => {
        try {
            const catHtmlPath = path.join(options.rootDir, 'data/cat/index.html');
            if (existsSync(catHtmlPath)) {
                const protocol = request.headers['x-forwarded-proto'] || (request.socket.encrypted ? 'https' : 'http');
                const hostname = request.hostname;
                let content = readFileSync(catHtmlPath, 'utf-8');
                const validUsername = process.env.API_AUTH_NAME || 'admin';
                const validPassword = process.env.API_AUTH_CODE || 'drpys';
                let catLink = `${protocol}://${validUsername}:${validPassword}@${hostname}/config/index.js.md5`;
                content = content.replace('$catLink', catLink);
                return reply.type('text/html').send(content);
            } else {
                reply.status(404).send({error: 'Favicon not found'});
            }
        } catch (error) {
            reply.status(500).send({error: 'Failed to fetch cat', details: error.message});
        }
    });

    fastify.get('/health', async (request, reply) => {
        return {
            status: 'ok',
            timestamp: toBeijingTime(new Date()),
            python: {
                available: await daemon.isPythonAvailable(),
                daemon_running: daemon.isDaemonRunning()
            }
        };
    });
    done();
};
