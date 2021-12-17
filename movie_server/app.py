import requests
import json

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
        img_link = movie_.find('div', 'img-item').find('a')['href']
        result.append({
            'title': title.strip(),
            'detail_link': detail_link.strip(),
            'img_link': img_link.strip(),
        })

    return json.dumps(result)


if __name__ == '__main__':
    app.run(debug=True)
