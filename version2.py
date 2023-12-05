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
    num_of_partners = re.search(r'\b(\d+)\b', target_div.text.strip()).group(1) if target_div else "1"
    return num_of_partners

async def get_data(urls, headers):
    async with aiohttp.ClientSession() as session:
        tasks = [get_data_for_page(session, url, headers) for url in urls]
        results = await asyncio.gather(*tasks)
    flattened_results = [item for sublist in results for item in sublist]
    return flattened_results

async def get_data_for_page(session, url, headers):
    response = await fetch(session, url, headers=headers)
    soup = BeautifulSoup(response, 'html.parser')
    all_product = soup.find_all('div', {'data-test': 'product-content'})

    product_details_list = []

    async with aiohttp.ClientSession() as session:
        tasks = [get_product_details(session, "https://proxy.cors.sh/https://www.bol.com/" + product.find('a', class_='product-title')['href'], headers) for product in all_product]
        results = await asyncio.gather(*tasks)

    for index, data in enumerate(all_product):
        product_name = data.find('a', class_='product-title px_list_page_product_click list_page_product_tracking_target')
        if product_name is None:
            continue
        product_url = "https://www.bol.com/" + product_name['href']

        price = data.find('span', class_='promo-price').text.replace('\n', '.', 1).replace('-', '') if data.find('span', class_='promo-price') else None

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

base_url = 'https://proxy.cors.sh/https://www.bol.com/nl/nl/s/'
params = {'view': 'list', '_c': 'xhr'}
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

# Generate URLs for the pages you want to scrape
page_numbers = [1,2,3,4]
urls = [f"{base_url}?page={page}&searchtext=mobile" for page in page_numbers]

loop = asyncio.get_event_loop()
result = loop.run_until_complete(get_data(urls, headers))