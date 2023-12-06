from fastapi import FastAPI, Query
from fastapi.responses import HTMLResponse  
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import aiohttp
import asyncio
from bs4 import BeautifulSoup
import re
app = FastAPI()


origins = [
    "https://uibob.sddoc.in",
    "http://localhost:3000",
    "http://localhost:3000/",
    "http://bol.bluechip-it.nl", 
    "https://bol.bluechip-it.nl"
    "https://improved-yodel-jw6rgqjg4gv35r79-3000.app.github.dev",
    "https://glorious-space-dollop-rq964wvjrpq356pq-3000.app.github.dev",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/', response_class=HTMLResponse)
async def index():
    htmlindex = """
   <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Bol.com Scraper</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>

<body class="bg-gray-100">
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold text-center mt-8 mb-6">Welcome Bob to the Bol.com Scraper</h1>

        <div class="flex justify-center">
            <a href="/getdata?minpage=1&maxpage=4&querry=charger"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Get Data
            </a>
        </div>
    </div>
</body>

</html>

    """

    return htmlindex 


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

# async def get_data(urls, headers):
#     async with aiohttp.ClientSession() as session:
#         tasks = [get_data_for_page(session, url, headers) for url in urls]
#         results = await asyncio.gather(*tasks)
#     flattened_results = [item for sublist in results for item in sublist]
#     return flattened_results



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


async def get_data(minpage: int, maxpage: int, querry: str):
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
    page_numbers = list(range(minpage, maxpage + 1))
    urls = [f"{base_url}?page={page}&searchtext={querry}" for page in page_numbers]

    async with aiohttp.ClientSession() as session:
        tasks = [get_data_for_page(session, url, headers) for url in urls]
        results = await asyncio.gather(*tasks)

    flattened_results = [item for sublist in results for item in sublist]
    return flattened_results

@app.get("/getdata")
async def get_data_endpoint(minpage: int = Query(..., description="Minimum page number"),
                            maxpage: int = Query(..., description="Maximum page number"),
                            querry: str = Query(..., description="Search query")):
    data = await get_data(minpage, maxpage, querry)
    return JSONResponse(content=data)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)