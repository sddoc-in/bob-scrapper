from bs4 import BeautifulSoup
import requests, re, json, time
from collections import OrderedDict
from flask import Flask,request, jsonify
from flask_cors import CORS
app = Flask(__name__)
cors = CORS(app, origins=["https://uibob.sddoc.in","http://bol.bluechip-it.nl", "https://bol.bluechip-it.nl" ,"http://localhost:3000","http://localhost:3000/" ,"https://improved-yodel-jw6rgqjg4gv35r79-3000.app.github.dev", "https://glorious-space-dollop-rq964wvjrpq356pq-3000.app.github.dev"])

@app.route('/')
def index():
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
            <a href="/getdata?page=1&querry=charger"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Get Data
            </a>
        </div>
    </div>
</body>

</html>

    """

    return htmlindex 

def getdata(page,querry):
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

    params = {
        'page': str(page),
        'searchtext': querry,
        'view': 'list',
        '_c': 'xhr',
        # 'bltgc': 'oMbHe-J-BF28K2tWBahEpg',
    }

    response = requests.get('https://proxy.cors.sh/https://www.bol.com/nl/nl/s/', params=params, headers=headers)

    Soup = BeautifulSoup(response.text, 'html.parser')
    with open('bol.html', 'w', encoding='utf-8') as f:
        f.write(Soup.prettify())
    ALLproduct =  Soup.find_all('div', {'data-test': 'product-content'})

    product_details_list = []
    for data in ALLproduct:
        productName= data.find('a', class_ = 'product-title px_list_page_product_click list_page_product_tracking_target')
        try:
            productUrl = "https://proxy.cors.sh/https://www.bol.com/" + productName['href']
        except:
            # print(productName)
            continue
        responsePartner= requests.get(productUrl, headers=headers)
        partnerSoup = BeautifulSoup(responsePartner.text, 'html.parser')
        target_div = partnerSoup.find('div', class_='buy-block__alternative-sellers-card__title', string=lambda text: 'partners' in text.lower())
        try:
            NumOfpartners = target_div.text.strip()
        except:
            NumOfpartners = "1" # if there is no partners
        # NumOfpartners = "not have" # if there is no partners/
        try:
            originalPrice = data.find('del', class_= 'h-nowrap').text
        except:
            originalPrice="it is already on original price"
        
        brandName = data.find('ul', class_= 'product-creator').text
        star_rating_div = data.find('div', class_='star-rating')
        try:
            data_count_value = star_rating_div.get('data-count')
            title_value = star_rating_div.get('title')
            title_value = re.search(r'(\d+(?:,\d+)?)', title_value).group(1).replace(',', '.')

        except:
            data_count_value='0'
            title_value= "no reviews"
        pattern = re.compile(r'(.+)(?=Levertijd)', re.DOTALL)
        delvierybefore = data.find('div', class_="product-delivery")
        try:
            delivery_time_text = delvierybefore.get_text(strip=True, separator='\n')
            match = pattern.search(delivery_time_text)
            delivery_time_text = match.group(1).strip()
        except:
            delivery_time_text= "not have"
        
        try:
            price = data.find('span', class_='promo-price').text
            price = price.replace("\n", "").replace("  ", ".")
            if "-" in price:
                price=price.replace("-", "").replace(".", "")
        except:
            pass
        brandName = brandName.replace("\n","")
        try:
            product_details ={
                'Brand Name': brandName,
                'Product Name': productName.text,
                'Price': price,
                'Rating': title_value,
                'Total Reviews': data_count_value,
                'Delivery Time': delivery_time_text,
                'Real Price': originalPrice,
                'Product Url': productUrl,
                'Partners': NumOfpartners
            }
            product_details_list.append(product_details)
        except:
            pass
    return product_details_list


@app.route('/getdata')
def getdata1():
    page = request.args.get('page')
    querry = request.args.get('querry')
    data = getdata(page,querry)
    response = app.response_class(
        response=json.dumps(data, sort_keys=False),
        status=200,
        mimetype='application/json'
    )
    
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
    # app.run(debug=True)
