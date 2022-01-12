import urllib3
import time
from pget.down import Downloader

# URL = 'http://ipleoffice.iptime.org:5005/noonoo/video/tIvdGnAMC3eDgJrF2PMUKWyWFopRzRfuKnjlAYi5/seg-1-v1-a1.ts'
URL = 'https://cdn2.studiouniversal.net/video/QaurV4LIVHuiclHN4EXvSlZpk0lC8HepLp37xu1i/seg-1-v1-a1.ts'

headers = {
    "referer": "https://cdn2.studiouniversal.net/",
    "origin": "cdn2.studiouniversal.net",
    "accept-ranges": "bytes"
}

headers = [
    "referer:https://cdn2.studiouniversal.net/",
    "origin:cdn2.studiouniversal.net",
    "accept-ranges:bytes"
]


def ended(faa):
    print(faa.get_state())


downloader = Downloader(URL, 'test.ts', 8, high_speed=True, headers=headers)

downloader.start()
downloader.subscribe(ended)
# downloader.subscribe(callback, callback_threshold)
downloader.wait_for_finish()
