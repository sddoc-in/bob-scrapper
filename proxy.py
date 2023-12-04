

import requests

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-GB,en;q=0.5',
    # 'Accept-Encoding': 'gzip, deflate, br',
    'Origin': 'https://geonode.com',
    'Connection': 'keep-alive',
    'Referer': 'https://geonode.com/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
    # Requests doesn't support trailers
    # 'TE': 'trailers',
}

params = {
    'limit': '500',
    'page': '1',
    'sort_by': 'lastChecked',
    'sort_type': 'desc',
    'country': 'NL',
}

response = requests.get('https://proxylist.geonode.com/api/proxy-list', params=params, headers=headers)


proxy =  response.json()

import random

randomProxy = random.choice(proxy['data'])
url =  'http://'+randomProxy['ip']+ ':' + randomProxy['port']
print(url)