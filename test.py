

# from bs4 import BeautifulSoup
# import requests, re, json, time

# # headers = {
# #     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
# #     'Accept': 'application/json, text/plain, */*',
# #     'Accept-Language': 'en-GB,en;q=0.5',
# #     # 'Accept-Encoding': 'gzip, deflate, br',
# #     'Origin': 'https://geonode.com',
# #     'Connection': 'keep-alive',
# #     'Referer': 'https://geonode.com/',
# #     'Sec-Fetch-Dest': 'empty',
# #     'Sec-Fetch-Mode': 'cors',
# #     'Sec-Fetch-Site': 'same-site',
# #     'Pragma': 'no-cache',
# #     'Cache-Control': 'no-cache',
# #     # Requests doesn't support trailers
# #     # 'TE': 'trailers',
# # }

# # params = {
# #     'limit': '500',
# #     'page': '1',
# #     'sort_by': 'lastChecked',
# #     'sort_type': 'desc',
# #     'country': 'NL',
# # }

# # response = requests.get('https://proxylist.geonode.com/api/proxy-list', params=params, headers=headers)


# # proxy =  response.json()

# # import random

# # randomProxy = random.choice(proxy['data'])
# # url =  'http://'+randomProxy['ip']+ ':' + randomProxy['port']
# # print(url)

# import requests

# headers = {
#     'authority': 'www.bol.com',
#     'accept': 'application/json, text/plain, */*',
#     'accept-language': 'en-US,en;q=0.9',
#     'referer': 'https://www.bol.com/nl/nl/s/?searchtext=charger',
#     'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
#     'sec-ch-ua-mobile': '?0',
#     'sec-ch-ua-platform': '"Windows"',
#     'sec-fetch-dest': 'empty',
#     'sec-fetch-mode': 'cors',
#     'sec-fetch-site': 'same-origin',
#     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
#     'x-requested-with': 'xhr',
# }

# params = {
#     'page': "1",
#     'searchtext': "mobile",
#     'view': 'list',
#     '_c': 'xhr',
#     # 'bltgc': 'oMbHe-J-BF28K2tWBahEpg',
# }

# response = requests.get('https://www.bol.com/nl/nl/s/', params=params, headers=headers)

# Soup = BeautifulSoup(response.text, 'html.parser')
# with open('index.html', 'w', encoding='utf-8') as f:
#     f.write(Soup.prettify())
# # ALLproduct =  Soup.find_all('div', {'data-test': 'product-content'})
# ALLproduct =  Soup.find_all('div', {'data-test': 'product-content'})

# product_details_list = []
# for data in ALLproduct:
#     productName= data.find('a', class_ = 'product-title px_list_page_product_click list_page_product_tracking_target')
#     try:
#         productUrl = "https://www.bol.com/" + productName['href']
#     except:
#         # print(productName)
#         continue
#     responsePartner= requests.get(productUrl, headers=headers)
#     partnerSoup = BeautifulSoup(responsePartner.text, 'html.parser')
#     target_div = partnerSoup.find('div', class_='buy-block__alternative-sellers-card__title', string=lambda text: 'partners' in text.lower())
#     try:
#         NumOfpartners = target_div.text.strip()
#     except:
#         NumOfpartners = "1" # if there is no partners
#     # NumOfpartners = "not have" # if there is no partners/
#     try:
#         originalPrice = data.find('del', class_= 'h-nowrap').text
#     except:
#         originalPrice="it is already on original price"
    
#     brandName = data.find('ul', class_= 'product-creator').text
#     star_rating_div = data.find('div', class_='star-rating')
#     try:
#         data_count_value = star_rating_div.get('data-count')
#         title_value = star_rating_div.get('title')
#         title_value = re.search(r'(\d+(?:,\d+)?)', title_value).group(1).replace(',', '.')

#     except:
#         data_count_value='0'
#         title_value= "no reviews"
#     pattern = re.compile(r'(.+)(?=Levertijd)', re.DOTALL)
#     delvierybefore = data.find('div', class_="product-delivery")
#     try:
#         delivery_time_text = delvierybefore.get_text(strip=True, separator='\n')
#         match = pattern.search(delivery_time_text)
#         delivery_time_text = match.group(1).strip()
#     except:
#         delivery_time_text= "not have"
    
#     try:
#         price = data.find('span', class_='promo-price').text
#         price = price.replace("\n", "").replace("  ", ".")
#         if "-" in price:
#             price=price.replace("-", "").replace(".", "")
#     except:
#         pass
#     brandName = brandName.replace("\n","")
#     try:
#         product_details ={
#             'Brand Name': brandName,
#             'Product Name': productName.text,
#             'Price': price,
#             'Rating': title_value,
#             'Total Reviews': data_count_value,
#             'Delivery Time': delivery_time_text,
#             'Real Price': originalPrice,
#             'Product Url': productUrl,
#             'Partners': NumOfpartners
#         }
#         print(product_details)
#         product_details_list.append(product_details)
#     except:
#         pass
#     # return product_details_list
# print(product_details_list)

import requests
import aiohttp
import asyncio
from bs4 import BeautifulSoup
import re

async def fetch(session, url, headers=None, params=None):
    async with session.get(url, headers=headers, params=params) as response:
        return await response.text()

async def get_product_details(session, product_url, headers):
    response = await fetch(session, product_url, headers=headers)
    partner_soup = BeautifulSoup(response, 'html.parser')
    target_div = partner_soup.find('div', class_='buy-block__alternative-sellers-card__title', string=lambda text: 'partners' in text.lower())
    num_of_partners = target_div.text.strip() if target_div else "1"

    return num_of_partners

async def get_data(url, params, headers):
    async with aiohttp.ClientSession() as session:
        response = await fetch(session,url, headers=headers, params=params)

    soup = BeautifulSoup(response, 'html.parser')
    all_product = soup.find_all('div', {'data-test': 'product-content'})

    product_details_list = []

    async with aiohttp.ClientSession() as session:
        tasks = [get_product_details(session, "https://proxy.cors.sh/https://www.bol.com/" + product.find('a', class_='product-title')['href'], headers) for product in all_product]
        results = await asyncio.gather(*tasks)

    for index, data in enumerate(all_product):
        product_name = data.find('a', class_='product-title px_list_page_product_click list_page_product_tracking_target')
        product_url = "https://www.bol.com/" + product_name['href']
        response_partner = requests.get(product_url, headers=headers)
        price = data.find('span', class_='promo-price').text.replace("\n", "").replace("  ", ".") if data.find('span', class_='promo-price') else None

        try:
            original_price = data.find('del', class_='h-nowrap').text
        except:
            original_price = "it is already on the original price"

        brand_name = data.find('ul', class_='product-creator').text.replace("\n", "")
        star_rating_div = data.find('div', class_='star-rating')
        try:
            data_count_value = star_rating_div.get('data-count', '0')
            title_value = re.search(r'(\d+(?:,\d+)?)', star_rating_div.get('title', 'no reviews')).group(1).replace(',', '.') if star_rating_div else '0'
        except:
            data_count_value = '0'
            title_value = 'no reviews'

        pattern = re.compile(r'(.+)(?=Levertijd)', re.DOTALL)
        delivery_before = data.find('div', class_="product-delivery")
        delivery_time_text = pattern.search(delivery_before.get_text(strip=True, separator='\n')).group(1).strip() if delivery_before else "not have"

        product_details = {
            'Brand Name': brand_name,
            'Product Name': product_name.text,
            'Price': price,
            'Rating': title_value,
            'Total Reviews': data_count_value,
            'Delivery Time': delivery_time_text,
            'Real Price': original_price,
            'Product Url': product_url,
            'Partners': results[index]
        }

        product_details_list.append(product_details)

    return product_details_list

# Example usage:
url = 'https://proxy.cors.sh/https://www.bol.com/nl/nl/s/'
params = {'page': "1", 'searchtext': "mobile", 'view': 'list', '_c': 'xhr'}
headers = {
    'authority': 'www.bol.com',
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'referer': 'https://www.bol.com/nl/nl/s/?searchtext=charger',
    'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'x-requested-with': 'xhr',
    "x-cors-api-key": "live_a7f7c7a3bb2ac6518e0b2853f8616e85136068753c42ec10dde22af423ea68dc",
}

loop = asyncio.get_event_loop()
result = loop.run_until_complete(get_data(url, params, headers))
print(result)
