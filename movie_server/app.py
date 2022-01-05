import requests
import json
import clipboard

from core import returnResponse

from bs4 import BeautifulSoup
from flask import Flask, request, Response
from flask_restx import Api
from flask_cors import CORS

from movie import movie_container
import logging

logging.getLogger('flask_cors').level = logging.DEBUG

app = Flask(__name__)
api = Api(app)

api.add_namespace(movie_container, '/movie')

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
            'part': 'snippet',
            'q': keyword,
            # 'pageToken': page,
            # 'videoEmbeddable': True,
            'key': YOUTUBE_API_KEY,
            'maxResult': max_result,
        }
        resp = requests.get(url, params=params)
        return resp.text

    def videos(self, max_result):
        url = 'https://www.googleapis.com/youtube/v3/videos'
        params = {
            'key': YOUTUBE_API_KEY,
            'part': 'snippet',
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

    list = []

    if 'items' in data:
        for video in data['items']:
            snippet = video['snippet']

            id_ = video['id']
            title = snippet['title']
            desc = snippet['description']
            try:
                thumb = snippet['thumbnails']['standard']['url']
            except:
                thumb = ''
            channel_title = snippet['channelTitle']

            list.append({
                'title': title,
                'desc': desc,
                'thumb': thumb,
                'channelTitle': channel_title,
                'embed_link': f'https://youtube.com/embed/{id_}',
            })

    return json.dumps(list)


# Const
youtube_ = Youtube()

if __name__ == '__main__':
    # youtube.search()

    app.run(debug=True, host='0.0.0.0', port=5005)
