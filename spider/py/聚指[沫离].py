"""
@header({
  searchable: 1,
  filterable: 0,
  quickSearch: 1,
  title: '聚指[沫离]',
  lang: 'hipy',
  ext: '{"keys":"11GK2we32144LO&hilUITB)FMd1khdaF,OC1A06E197EF10CF3F6058CA7A803B5E","pub":"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCr8SzZhjYy+rsya1K09t8d2K50pWFoBkgUqMpKOiW+3IEVKd4eTdvg9RSOjQ82kypL6R9BnsmrS1V8s4PVDwjQbUtYhTPPC9Hz16qY7rpD6m0d2vr09/UpWQ5uOy9PR0QTrsioveZ+DIe9jc3C+zBCu/kZSY/R8stwJoiitki3gwIDAQAB","pkg":"com.lxf.snzlcgtzxyx"}'
})
"""

# -*- coding: utf-8 -*-
import json
import sys
import time
import os

sys.path.append("..")
from Crypto.Cipher import AES
from Crypto.Cipher import PKCS1_v1_5
from Crypto.PublicKey import RSA
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
from base64 import b64encode, b64decode

try:
    from base.spider import BaseSpider
except ImportError:
    from t4.base.spider import BaseSpider


class Spider(BaseSpider):

    def __init__(self, query_params=None, t4_api=None):
        super().__init__(query_params=query_params, t4_api=t4_api)
        self.BASE_URL = 'http://103.45.131.38:50001'
        self.AES_KEY = b'OC1A06E197EF10CF3F6058CA7A803B5E'
        self.RSA_PUB_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCr8SzZhjYy+rsya1K09t8d2K50pWFoBkgUqMpKOiW+3IEVKd4eTdvg9RSOjQ82kypL6R9BnsmrS1V8s4PVDwjQbUtYhTPPC9Hz16qY7rpD6m0d2vr09/UpWQ5uOy9PR0QTrsioveZ+DIe9jc3C+zBCu/kZSY/R8stwJoiitki3gwIDAQAB'
        self.PKG = 'com.lxf.snzlcgtzxyx'
        self.APP_VERSION = '3.0.2.2'
        self.deviceId = ''
        self.rsa_key = None
        self.headers = {
            'User-Agent': 'okhttp/3.12.1',
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'Connection': 'Keep-Alive',
            'Accept-Encoding': 'gzip'
        }

    def init(self, extend=""):
        try:
            config = json.loads(self.extend.strip())
        except Exception:
            config = {}
        if config.get('keys'):
            parts = config['keys'].split(',')
            if len(parts) >= 2:
                self.AES_KEY = parts[1].encode('utf-8')
        if config.get('pub'):
            self.RSA_PUB_KEY = config['pub']
        if config.get('pkg'):
            self.PKG = config['pkg']
        self.deviceId = os.urandom(8).hex().upper()
        try:
            self.rsa_key = RSA.import_key(b64decode(self.RSA_PUB_KEY))
        except Exception:
            self.rsa_key = RSA.import_key(
                b'-----BEGIN PUBLIC KEY-----\n' +
                self.RSA_PUB_KEY.encode() +
                b'\n-----END PUBLIC KEY-----'
            )

    def getName(self):
        return '聚指[沫离]'

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def destroy(self):
        pass

    def rsaEncrypt(self, plain):
        cipher = PKCS1_v1_5.new(self.rsa_key)
        encrypted = cipher.encrypt(plain.encode('utf-8'))
        return b64encode(encrypted).decode()

    def aesEncrypt(self, data):
        key = self.AES_KEY[:32]
        cipher = AES.new(key, AES.MODE_ECB)
        padded = pad(data.encode('utf-8'), AES.block_size)
        encrypted = cipher.encrypt(padded)
        return encrypted.hex()

    def aesDecrypt(self, data_b64):
        key = self.AES_KEY[:32]
        cipher = AES.new(key, AES.MODE_ECB)
        encrypted = b64decode(data_b64)
        decrypted = unpad(cipher.decrypt(encrypted), AES.block_size)
        return decrypted.decode('utf-8')

    def buildDeviceInfo(self):
        return {
            'appVersion': self.APP_VERSION,
            'deviceId': self.deviceId,
            'system': 'Android',
            'model': 'Pixel 4',
            'brand': 'Google',
            'sdk': '29',
            'pkg': self.PKG,
            'uuid': os.urandom(16).hex().upper(),
            'abi': 'arm64-v8a',
            'screen': '1080x1920',
            'dpi': '420'
        }

    def generatePublicParams(self):
        deviceInfo = self.buildDeviceInfo()
        timestamp = str(int(time.time() * 1000))
        randomStr = os.urandom(8).hex()
        signPlain = timestamp + randomStr + self.deviceId
        sign = self.rsaEncrypt(signPlain)
        finalJson = dict(deviceInfo)
        finalJson['sign'] = sign
        finalJson['timestamp'] = timestamp
        finalJson['randomStr'] = randomStr
        paramsData = self.aesEncrypt(json.dumps(finalJson, separators=(',', ':')))
        return json.dumps({'paramsData': paramsData}, separators=(',', ':'))

    def request(self, path, query=None):
        url = self.BASE_URL + path
        if query:
            import urllib.parse
            url += '?' + urllib.parse.urlencode(query)
        publicParams = self.generatePublicParams()
        req_headers = dict(self.headers)
        req_headers['publicParams'] = publicParams
        try:
            resp = self.fetch(url, headers=req_headers, verify=False, timeout=10)
            content = resp.text
        except Exception as e:
            self.log(f'[聚指] request error: {e}')
            return None
        if not content:
            return None
        try:
            data = json.loads(content)
            if isinstance(data.get('data'), str) and len(data['data']) > 100:
                try:
                    decrypted = self.aesDecrypt(data['data'])
                    data['data'] = json.loads(decrypted)
                except Exception:
                    pass
            return data
        except Exception:
            return content

    def homeContent(self, filter):
        return {
            'class': [
                {'type_id': '1', 'type_name': '电影'},
                {'type_id': '2', 'type_name': '电视剧'},
                {'type_id': '3', 'type_name': '综艺'},
                {'type_id': '4', 'type_name': '动漫'},
                {'type_id': '5', 'type_name': '短剧'}
            ]
        }

    def homeVideoContent(self):
        try:
            resp = self.request('/api/v3/drama/recommend')
            if not resp or not resp.get('data'):
                return {'list': []}
            data = resp['data']
            items = data if isinstance(data, list) else data.get('list', [])
            videos = []
            for item in items:
                videos.append({
                    'vod_id': str(item.get('id', item.get('dramaId', ''))),
                    'vod_name': item.get('title', item.get('name', '')),
                    'vod_pic': item.get('cover', item.get('image', '')),
                    'vod_remarks': item.get('score', item.get('remark', ''))
                })
            return {'list': videos}
        except Exception as e:
            self.log(f'[聚指] homeVideo error: {e}')
            return {'list': []}

    def categoryContent(self, tid, pg, filter, extend):
        try:
            pg = pg or 1
            resp = self.request('/api/v3/drama/list', {
                'categoryId': str(tid),
                'page': str(pg),
                'pageSize': '20',
                'orderBy': 'updateTime'
            })
            if not resp or not resp.get('data'):
                return {'list': [], 'page': pg, 'pagecount': 1, 'total': 0}
            data = resp['data']
            items = data.get('list', data.get('records', []))
            videos = []
            for item in items:
                videos.append({
                    'vod_id': str(item.get('id', item.get('dramaId', ''))),
                    'vod_name': item.get('title', item.get('name', '')),
                    'vod_pic': item.get('cover', item.get('image', '')),
                    'vod_remarks': item.get('score', item.get('remark', ''))
                })
            total = data.get('total', len(videos))
            return {
                'list': videos,
                'page': pg,
                'pagecount': max((total + 19) // 20, 1),
                'total': total
            }
        except Exception as e:
            self.log(f'[聚指] category error: {e}')
            return {'list': [], 'page': pg, 'pagecount': 1, 'total': 0}

    def detailContent(self, ids):
        try:
            vod_id = ids[0] if isinstance(ids, list) else ids
            resp = self.request('/api/v3/drama/detail', {'dramaId': str(vod_id)})
            if not resp or not resp.get('data'):
                return {'list': []}
            d = resp['data']
            vod = {
                'vod_id': str(vod_id),
                'vod_name': d.get('title', d.get('name', '')),
                'vod_pic': d.get('cover', d.get('image', '')),
                'vod_remarks': d.get('score', d.get('remark', '')),
                'vod_year': str(d.get('year', '')),
                'vod_area': d.get('area', ''),
                'vod_actor': d.get('actor', d.get('actors', '')),
                'vod_director': d.get('director', ''),
                'vod_content': d.get('description', d.get('desc', ''))
            }
            episodes = d.get('episodes', [])
            if episodes:
                playlist = {}
                for ep in episodes:
                    sourceName = ep.get('source', '默认')
                    if sourceName not in playlist:
                        playlist[sourceName] = []
                    playlist[sourceName].append(ep['title'] + '$' + str(ep['id']))
                vod['vod_play_from'] = '$$$'.join(playlist.keys())
                vod['vod_play_url'] = '$$$'.join('#'.join(arr) for arr in playlist.values())
            return {'list': [vod]}
        except Exception as e:
            self.log(f'[聚指] detail error: {e}')
            return {'list': []}

    def searchContent(self, key, quick, pg="1"):
        try:
            pg = pg or 1
            resp = self.request('/api/v3/drama/search', {
                'keyword': key,
                'page': str(pg),
                'pageSize': '20'
            })
            if not resp or not resp.get('data'):
                return {'list': [], 'page': pg}
            data = resp['data']
            items = data.get('list', data.get('records', []))
            videos = []
            for item in items:
                videos.append({
                    'vod_id': str(item.get('id', item.get('dramaId', ''))),
                    'vod_name': item.get('title', item.get('name', '')),
                    'vod_pic': item.get('cover', item.get('image', '')),
                    'vod_remarks': item.get('score', item.get('remark', ''))
                })
            return {'list': videos, 'page': pg}
        except Exception as e:
            self.log(f'[聚指] search error: {e}')
            return {'list': [], 'page': pg}

    def playerContent(self, flag, id, vipFlags=None):
        try:
            resp = self.request('/api/v3/drama/play', {'episodeId': str(id)})
            if not resp or not resp.get('data'):
                return {'parse': 0, 'url': '', 'header': {}}
            playUrl = resp['data'].get('url', resp['data'].get('playUrl', ''))
            playHeaders = resp['data'].get('headers', {})
            return {
                'parse': 0,
                'url': playUrl,
                'jx': 0,
                'header': dict(playHeaders) if playHeaders else {}
            }
        except Exception as e:
            self.log(f'[聚指] player error: {e}')
            return {'parse': 0, 'url': '', 'header': {}}

    def localProxy(self, param):
        pass
