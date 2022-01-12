import os, requests
import threading
import time
import requests
import urllib3

class DownloadManager():
    dataDict = {}

    def __init__(self):
        self.dataDict = {}

    #create a list of split ranges in bytes
    def buildRange(self, value, numsplits):
        lst = []
        for i in range(numsplits):
            if i == 0:
                lst.append('%s-%s' % (i, int(round(1 + i * value/(numsplits*1.0) + value/(numsplits*1.0)-1, 0))))
            else:
                lst.append('%s-%s' % (int(round(1 + i * value/(numsplits*1.0),0)), int(round(1 + i * value/(numsplits*1.0) + value/(numsplits*1.0)-1, 0))))
        # print (f"Splitted list:{lst}")
        return lst

    def downloadChunk(self, idx, irange, url, headers):
        http = urllib3.PoolManager()
        print(f'irange : {irange}')
        headers['Range'] = f'bytes={irange}'

        if 'accept-ranges' in headers:
            del headers['accept-ranges']

        resp = requests.get(url, headers=headers)
        resp_data = resp.content

        # print(f'idx: {idx} irange: {irange}')
        self.dataDict[idx] = resp_data


    def request(self, url, headers={}, splitter=1):
        http = requests.head(url, headers=headers)
        sizeInBytes = http.headers.get('content-length', None)

        print(f'sizeInBytes : {sizeInBytes}')

        # print(f'sizeInBytes : {sizeInBytes}')
        ranges = self.buildRange(int(sizeInBytes), splitter)

        # print(f'range :{ranges}')

        # obviously you could do it sequentially but have added a thread here just to demo the worst case with threads
        # create one downloading thread per chunk
        downloaders = [
            threading.Thread(
                target=self.downloadChunk, 
                args=(idx, irange, url, headers),
            )
            for idx,irange in enumerate(ranges)
        ]

        # start threads, lets run in parallel, wait for all to finish
        for th in downloaders:
            th.start()
        for th in downloaders:
            th.join()

        iter_ = (len(chunk) for chunk in self.dataDict.values())
        total = sum (iter_)

        # print (f'done: got {len(dataDict)} chunks, total {total} bytes')
        # print (f'download end time : {time.time() - start_time}')

        data = b''
        for _idx,chunk in sorted(self.dataDict.items()):
            # print(f'idx : {_idx}')
            data = data + chunk

        # print (f'write end : {time.time() - start_time}')
        print(f'-- Ended Split Download {url}')

        
        # print(f'{os.chdir(__file__).test.ts}')
        # f = open('/test.ts', 'wb')
        # f.write(data)
        # f.close()

        return data

