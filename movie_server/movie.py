import requests
import json
import clipboard

from urllib.parse import urlparse, parse_qs

from bs4 import BeautifulSoup

from core import returnResponse
from flask import request
from flask_restx import Resource, Api, Namespace

HOST = 'https://t8.tvmeka.com/'

movie_container = Namespace('movie')

DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
}


@movie_container.route('/')
class Movie(Resource):
    def get(self):
        params = request.args.to_dict()

        _type = 'kmovie'
        _page = '1'
        _keyword = ''
        _upstream = False

        print(params)
        if 'type' in params:
            _type = params['type']

        if 'page' in params:
            _page = params['page']

        if 'keyword' in params:
            _keyword = params['keyword']
            url = f'{HOST}bbs/search.php?sfl=wr_subject%7C%7Cwr_content&stx={_keyword}&sop=and&gr_id=&onetable={_type}&page={_page}'
            resp_ = requests.get(url)
            bs4 = BeautifulSoup(resp_.text, 'html.parser')
            try:
                media_elements = bs4.find(class_='search-media').find_all('div', class_='media')
            except:
                return returnResponse('{}')

            result = []
            for media in media_elements:
                img_element = media.find('img')
                a_element = media.find(class_='media-heading').find('a')
                href = a_element['href']
                href = f'{HOST}bbs/{href}'
                title = a_element.text.strip()
                detail_num = urlparse(href)
                detail_num = ''.join(parse_qs(detail_num.query)['wr_id'])
                img_link = ''
                try:
                    img_link = img_element['src']
                except:
                    pass

                result.append({
                    'title': title.strip(),
                    'detail_link': href.strip(),
                    'detail_num': detail_num.strip(),
                    'img_link': img_link.strip(),
                })

        else:
            headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
                'referer': f'{HOST}',
            }

            url = f'{HOST}bbs/board.php?bo_table={_type}&page={_page}'
            resp_ = requests.get(url, headers=headers)
            bs4 = BeautifulSoup(resp_.text, 'html.parser')
            movie_list = bs4.find('div', class_='list-container')
            movie_list = movie_list.find_all('div', class_='list-item')

            result = []
            for movie_ in movie_list:
                title = movie_.find('h2').find('a').text
                detail_link = movie_.find('h2').find('a')['href']
                detail_num = urlparse(detail_link)
                detail_num = ''.join(parse_qs(detail_num.query)['wr_id'])
                img_link = movie_.find('div', 'img-item').find('a').find('img')['src']
                result.append({
                    'title': title.strip(),
                    'detail_link': detail_link.strip(),
                    'detail_num': detail_num.strip(),
                    'img_link': img_link.strip(),
                })
        if 'upstream' in params:
            result = movie_except_upstream(_type, result)

        return returnResponse(result)


def movie_except_upstream(_type, result):
    new_result = []
    for d_ in result:
        dd = request_detail(_type, d_['detail_num'])
        if 0 < len(dd):
            d_['video_link'] = dd[0]['detail']
            new_result.append(d_)
            continue

    return returnResponse(new_result)


def evoload(link):
    headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        'cookie': 'adonis-session=b2a22f0492272a99313971370623a810HQ%2Fx1A98CUuxR9BOrPcqOPunsrpjz55R4zdYoJGYQJo54vWkLorL9Ye6Le%2B5UsHQ%2Foy5IV9PvQ805pE%2FdRIyI2JhttBjnLFugyu61yuHvbftEzi3%2BxqlbYO7DPhpmPlH; adonis-session-values=13b9747111fa0f3fe3c5701221726e0dO7NRiEik4e1eCrui%2FF60OpPqFL1s%2Fcg%2B%2BXSEHizlHwc%2BX%2FPO8HjfmpRKtEz%2FlLMcBZWj%2BcAdJYBbCSD7r%2BO9S%2FnL1KZROSBVwy3tm%2F%2FwFReqWaZlyYU6qpoZ17TQo1ppG7QNbk94EwEBsY9abk%2B%2F7Mv%2BcHyHExs4gunamlNSm%2F4%3D',
    }
    response = requests.get(link)
    cookie = response.cookies.get_dict()
    response = requests.post(
        'https://evoload.io/SecurePlayer',
        headers=response.headers
    )

    return returnResponse(response.text)


def request_detail(type_, num_):
    link = f'{HOST}bbs/board.php?bo_table={type_}&wr_id={num_}&page=1'

    response = requests.get(link)
    bs4 = BeautifulSoup(response.text, 'html.parser')
    table = bs4.find(class_='type11')
    links = table.find_all('a')

    result = []
    for movie_link in links:
        name = ''.join(movie_link['class'])
        detail_link = movie_link['href']
        video_link = ''

        # TODO: 나중에는 모든 사이트에 비디오 링크 내놓도록
        name = name.lower()
        if not ('upstream' in name):
            continue

        # if 'Evo' in name or 'evo' in name:
        #     evoload(detail_link)
        #
        # else:
        #     response = requests.get(detail_link)
        #     bs4_ = BeautifulSoup(response.text, 'html.parser')
        #     clipboard.copy(response.text)
        #     video_link = bs4_.find('video')['src']

        result.append({
            'name': name,
            'detail': detail_link,
            'video': video_link
        })

    return returnResponse(result)


@movie_container.route('/host')
class Host(Resource):
    def get(self):
        global HOST
        result = {
            'url': HOST
        }
        return returnResponse(result)

    def post(self):
        global HOST
        data = request.form

        print(data)
        if 'host' in data:
            HOST = data['host']

        result = {
            'url': HOST
        }
        return returnResponse(result)


@movie_container.route('detail')
class Detail(Resource):
    def get(self):
        params = request.args.to_dict()
        if not ('num' in params) or not ('type' in params):
            return returnResponse({'Error': 'No Link'})
        type_ = params['type']
        num_ = params['num']

        result = request_detail(type_, num_)

        return returnResponse(result)

@movie_container.route('/noonoo')
class NoonooTvRouter(Resource):
    pass



class NoonooTv():
    HOST = 'https://noonoo.tv/'
    TYPE = [
        'kr_movie',
        'en_movie',
        'adult_movie',
        'ani_movie'
    ]

    def get(self, url, params={}):
        headers = DEFAULT_HEADERS
        headers['Referer'] = 'https://noonoo.tv/'
        headers['Host'] = 'noonoo.tv'
        resp = requests.get(url, params=params, headers=headers)
        return resp

    def get_type(self, num):
        return self.TYPE[num]

    def get_video_info(self, type_, num_):
        url = f'{self.HOST}{type_}/{num_}'

        resp = self.get(url)
        bs = BeautifulSoup(resp.text, 'html.parser')
        src = bs.find('lite-iframe').get('src')

        print(src)
        self.get_video_link(src)
        clipboard.copy(resp.text)

        return resp.text

    def get_video_link(self, src):
        headers = {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "referer": "https://noonoo.tv/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        }
        # url = 'https://player2.studiouniversal.net/video/WqQ6X8N7qMI1Rb4'
        resp = requests.get(src, headers=headers)
        new_src = resp.text.split('"file": "')[1].split('",')[0]
        print(new_src)
        return new_src

    def get_m3u8(self, src):
        headers = {
            "referer": "https://cdn2.studiouniversal.net/",
            "origin": "cdn2.studiouniversal.net"
        }

        resp = requests.get(src, headers=headers)
        return resp.content


if __name__ == '__main__':
    noonoo = NoonooTv()
    # noonoo.temp()
    noonoo.get_video_info(noonoo.get_type(1), 1962)
