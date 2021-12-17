import requests
import json
import clipboard

from urllib.parse import urlparse, parse_qs

from bs4 import BeautifulSoup
from flask import Flask
from flask import request

app = Flask(__name__)


@app.route('/')
def main():
    return '<p>TEST</p>'


@app.route('/movie', methods=['GET'])
def movie():
    params = request.args.to_dict()

    _type = 'kmovie'
    _page = '1'

    print(params)
    if 'type' in params:
        _type = params['type']

    if 'page' in params:
        _page = params['page']

    response = requests.get(f'https://t6.tvmeka.com/bbs/board.php?bo_table={_type}&page={_page}')
    bs4 = BeautifulSoup(response.text, 'html.parser')
    movie_list = bs4.find('div', class_='list-container')
    movie_list = movie_list.find_all('div', class_='list-item')

    result = []
    for movie_ in movie_list:
        title = movie_.find('h2').find('a').text
        detail_link = movie_.find('h2').find('a')['href']
        detail_num = urlparse(detail_link)
        detail_num = parse_qs(detail_num.query)['wr_id']
        img_link = movie_.find('div', 'img-item').find('a')['href']
        result.append({
            'title': title.strip(),
            'detail_link': detail_link.strip(),
            'detail_num': detail_num.strip(),
            'img_link': img_link.strip(),
        })

    return json.dumps(result)


def evoload(link):
    print(f'Start {link}')
    headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        'cookie': 'adonis-session=b2a22f0492272a99313971370623a810HQ%2Fx1A98CUuxR9BOrPcqOPunsrpjz55R4zdYoJGYQJo54vWkLorL9Ye6Le%2B5UsHQ%2Foy5IV9PvQ805pE%2FdRIyI2JhttBjnLFugyu61yuHvbftEzi3%2BxqlbYO7DPhpmPlH; adonis-session-values=13b9747111fa0f3fe3c5701221726e0dO7NRiEik4e1eCrui%2FF60OpPqFL1s%2Fcg%2B%2BXSEHizlHwc%2BX%2FPO8HjfmpRKtEz%2FlLMcBZWj%2BcAdJYBbCSD7r%2BO9S%2FnL1KZROSBVwy3tm%2F%2FwFReqWaZlyYU6qpoZ17TQo1ppG7QNbk94EwEBsY9abk%2B%2F7Mv%2BcHyHExs4gunamlNSm%2F4%3D',
    }
    response = requests.get(link)
    cookie = response.cookies.get_dict()
    print(f'{cookie}')
    print(f'end {link}, {response.headers}')
    response = requests.post(
        'https://evoload.io/SecurePlayer',
        headers=response.headers
    )

    return response.text


@app.route('/movie/detail', methods=['GET'])
def detail():
    params = request.args.to_dict()
    if not ('num' in params) or not ('type' in params):
        return {'Error': 'No Link'}
    type_ = params['type']
    num_ = params['num']

    link = f'https://t6.tvmeka.com/bbs/board.php?bo_table={type_}&wr_id={num_}&page=1'

    response = requests.get(link)
    bs4 = BeautifulSoup(response.text, 'html.parser')
    table = bs4.find(class_='type11')
    clipboard.copy(link)
    links = table.find_all('a')

    result = []
    for movie_link in links:
        name = ''.join(movie_link['class'])
        detail_link = movie_link['href']
        video_link = ''

        # TODO: 나중에는 모든 사이트에 비디오 링크 내놓도록
        if not ('upstream' in name) and not ('Upstream' in name):
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

    return json.dumps(result)


if __name__ == '__main__':
    app.run(debug=True)
