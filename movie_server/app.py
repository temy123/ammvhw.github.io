import requests
import json
import clipboard
import datetime

from core import returnResponse

from bs4 import BeautifulSoup
from flask import Flask, request, Response
from flask_restx import Api
from flask_cors import CORS

from movie import movie_container, noonoo_container
import logging

logging.getLogger('flask_cors').level = logging.DEBUG

app = Flask(__name__)
api = Api(app)

api.add_namespace(movie_container, '/movie')
api.add_namespace(noonoo_container, '/noonoo')

CORS(app)

YOUTUBE_API_KEY = 'AIzaSyBwHmyE3BylutJPfsMbDE-Dfur6am6LyIQ'


@app.route('/')
def main():
    resp = Response('{}')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


@app.route('/youtube', methods=['GET'])
def youtube():
    params = request.args.to_dict()

    _keyword = ''
    _page = '1'

    if 'keyword' in params:
        _keyword = params['keyword']

    if 'page' in params:
        _page = params['page']

    headers = {
        'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',

    }
    response = requests.get(f'https://yewtu.be/search?q={_keyword}&page={_page}')
    response.raise_for_status()
    response.encoding = 'utf-8'

    bs4 = BeautifulSoup(response.text, 'html.parser')

    # clipboard.copy(response.text)

    media_elements = bs4.find_all(class_='pure-u-1 pure-u-md-1-4')
    result = []
    for media in media_elements:
        try:
            title = media.find('div', class_='thumbnail').parent.find_all('p')[1].text.strip()
        except:
            title = media.find('a').text.strip()

        thumb = 'https://yewtu.be' + media.find('img')['src']
        link = ''
        detail_link = ''
        try:
            link = media.find(class_='icon ion-logo-youtube').parent['href'].strip()
            detail_link = link.split('?v=')[1]
            detail_link = f'https://youtube.com/embed/{detail_link}?vq=hd1080'
        except:
            pass

        zip_ = {
            'title': title,
            'thumb': thumb,
            'link': link,
            'embed_link': detail_link
        }
        result.append(zip_)

    return returnResponse(json.dumps(result))


class Youtube:
    def search(self, keyword='우왁굳', page=1, max_result=20):
        url = 'https://www.googleapis.com/youtube/v3/search'
        params = {
            'part': 'snippet, contentDetails, statistics',
            'q': keyword,
            # 'pageToken': page,
            # 'videoEmbeddable': True,
            'key': YOUTUBE_API_KEY,
            'maxResult': max_result,
        }
        resp = requests.get(url, params=params)
        return resp.text

    def browse(self, key):
        url = f'https://www.youtube.com/youtubei/v1/browse?key={key}'

        headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
            'origin': 'https://www.youtube.com',
            'referer': 'https://www.youtube.com/',
        }

        data = '{"context":{"client":{"hl":"ko","gl":"KR","remoteHost":"121.187.225.82","deviceMake":"","deviceModel":"","visitorData":"CgtqV0hnbDBCRWprSSji-NWOBg%3D%3D","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36,gzip(gfe)","clientName":"WEB","clientVersion":"2.20220104.01.00","osName":"Windows","osVersion":"10.0","originalUrl":"https://www.youtube.com/","platform":"DESKTOP","clientFormFactor":"UNKNOWN_FORM_FACTOR","configInfo":{"appInstallData":"COL41Y4GEJHXrQUQgOqtBRCY6q0FENvrrQUQt8utBRC7x_0SEL3rrQUQzcn9EhDYvq0FEJH4_BI%3D"},"timeZone":"Asia/Seoul","browserName":"Chrome","browserVersion":"84.0.4147.89","screenWidthPoints":1365,"screenHeightPoints":969,"screenPixelDensity":1,"screenDensityFloat":1,"utcOffsetMinutes":540,"userInterfaceTheme":"USER_INTERFACE_THEME_LIGHT","connectionType":"CONN_CELLULAR_4G","memoryTotalKbytes":"4000000","mainAppWebInfo":{"graftUrl":"https://www.youtube.com/","pwaInstallabilityStatus":"PWA_INSTALLABILITY_STATUS_CAN_BE_INSTALLED","webDisplayMode":"WEB_DISPLAY_MODE_BROWSER","isWebNativeShareAvailable":false}},"user":{"lockedSafetyMode":false},"request":{"useSsl":true,"internalExperimentFlags":[],"consistencyTokenJars":[]},"clickTracking":{"clickTrackingParams":"CAAQhGciEwjVic32vpr1AhU5Sg8CHXN4AUM="},"adSignalsInfo":{"params":[{"key":"dt","value":"1641380964414"},{"key":"flash","value":"0"},{"key":"frm","value":"0"},{"key":"u_tz","value":"540"},{"key":"u_his","value":"17"},{"key":"u_h","value":"1080"},{"key":"u_w","value":"1920"},{"key":"u_ah","value":"1040"},{"key":"u_aw","value":"1920"},{"key":"u_cd","value":"24"},{"key":"bc","value":"31"},{"key":"bih","value":"969"},{"key":"biw","value":"1349"},{"key":"brdim","value":"0,0,0,0,1920,0,1920,1040,1365,969"},{"key":"vis","value":"1"},{"key":"wgl","value":"true"},{"key":"ca_type","value":"image"}],"bid":"ANyPxKrTXY7qgDnylpYa-eJmTU7LFVuHLt-_E5k-XtmKPVEg1V5XiAGqy0Mm-v7_VLEw4pFgx68S10km3_u4q8X_QDYsjaRi4Q"}},"continuation":"4qmFsgKxAhIPRkV3aGF0X3RvX3dhdGNoGoACQ0RCNnV3RkhURWhZT0dJMkxXMTJWVU5OWjNOSk16WlRiWFUwVURCdVRsOTNRVlp3YzBOdGIwdEhXR3d3V0ROQ2FGb3lWbVpqTWpWb1kwaE9iMkl6VW1aamJWWnVZVmM1ZFZsWGQxTklNV3MxWkRKU1IxWXdPVzVpTW5oS1ZUSTVRbUZ1YjNSYVJrcE5ZMWM1UzFJeU1VZGtWMWt3WVVkTllVeEJRVUZoTWpoQlFWVjBVMEZCUmt4VlowRkNRVVZhUm1ReWFHaGtSamt3WWpFNU0xbFlVbXBoUVVGQ1FVRkZRa0ZCUVVKQlFVVkJRVUZGUWkxd2VraDJVV3REUTBSRpoCGmJyb3dzZS1mZWVkRkV3aGF0X3RvX3dhdGNo"}'
        data = json.loads(data)

        resp = requests.post(url, headers=headers, data=data)

        return resp.text

    def videos(self, max_result):
        url = 'https://www.googleapis.com/youtube/v3/videos'
        params = {
            'key': YOUTUBE_API_KEY,
            'part': 'snippet, contentDetails, statistics',
            'chart': 'mostPopular',
            'maxResults': max_result,
            'regionCode': 'kr',
        }

        resp = requests.get(url, params=params)
        return resp.text


@app.route('/youtube/recommend', methods=['GET'])
def youtube_recommend_api():
    params = request.args.to_dict()

    try:
        max_result = params['max_result']
    except:
        max_result = 15

    data = json.loads(youtube_.videos(max_result))
    clipboard.copy(json.dumps(data))
    list = []

    if 'items' in data:
        for video in data['items']:
            snippet = video['snippet']

            id_ = video['id']
            title = snippet['title']
            desc = snippet['description']
            if 'standard' in snippet['thumbnails']:
                thumb = snippet['thumbnails']['standard']['url']
            elif 'high' in snippet['thumbnails']:
                thumb = snippet['thumbnails']['high']['url']
            elif 'medium' in snippet['thumbnails']:
                thumb = snippet['thumbnails']['medium']['url']
            else:
                thumb = snippet['thumbnails']['default']['url']
            
            published = snippet['publishedAt']
            published = datetime.datetime.strptime(published, "%Y-%m-%dT%H:%M:%SZ")
            hours = int(((datetime.datetime.now() - published).total_seconds() / (60 * 60)))

            if hours > 24 :
                published = f'{int(hours / 24)} 일전'
            else:
                published = f'{hours} 시간 전'

            channel_title = snippet['channelTitle']

            content_details = video['contentDetails']
            duration = content_details['duration']
            duration = duration[2:]
            duration_array = []
            if 'H' in duration:
                duration_array.append(int(duration.split('H')[0]))
                duration = duration.split('H')[1]
            if 'M' in duration:
                duration_array.append(int(duration.split('M')[0]))
                duration = duration.split('M')[1]
            if 'S' in duration:
                duration_array.append(int(duration.split('S')[0]))
            
            duration = ''
            for d in duration_array:
                duration = f'{duration:0>2}:{d:0>2}'
            duration = duration[1:]

            statistics = video['statistics']
            view_count = statistics['viewCount']

            list.append({
                'title': title,
                'desc': desc,
                'thumb': thumb,
                'duration': duration,
                'viewCount': view_count,
                'published': published,
                'channelTitle': channel_title,
                'embed_link': f'https://youtube.com/embed/{id_}',
            })

    return json.dumps(list)


# Const
youtube_ = Youtube()

if __name__ == '__main__':
    print(youtube_.browse(YOUTUBE_API_KEY))

    app.run(debug=True, host='0.0.0.0', port=5005)
