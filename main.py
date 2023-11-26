from bs4 import BeautifulSoup
import requests, re
from flask import Flask,request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    htmlindex = """
    <h1> Welcome to Bol.com Scraper </h1>
    <p> Please use the following URL to get the data: </p>
    <p> /getdata?page=1&querry=charger </p>
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
    }

    params = {
        'page': str(page),
        'searchtext': querry,
        'view': 'list',
        '_c': 'xhr',
        # 'bltgc': 'oMbHe-J-BF28K2tWBahEpg',
    }

    response = requests.get('https://www.bol.com/nl/nl/s/', params=params, headers=headers)

    Soup = BeautifulSoup(response.text, 'html')
    ALLproduct =  Soup.find_all('div', {'data-test': 'product-content'})

    product_details_list = []
    for data in ALLproduct:
        productName= data.find('a', class_ = 'product-title px_list_page_product_click list_page_product_tracking_target')
        try:
            productUrl = "https://www.bol.com/" + productName['href']
        except:
            print(productName)
            continue
        responsePartner= requests.get(productUrl)
        partnerSoup = BeautifulSoup(responsePartner.text, 'html')
        target_div = partnerSoup.find('div', class_='buy-block__alternative-sellers-card__title', string=lambda text: 'partners' in text.lower())
        try:
            originalPrice = data.find('del', class_= 'h-nowrap').text
        except:
            originalPrice="it is already on original price"
        try:
            NumOfpartners = target_div.text.strip()
        except:
            NumOfpartners = "not have"
        
        brandName = data.find('ul', class_= 'product-creator').text
        star_rating_div = data.find('div', class_='star-rating')
        try:
            data_count_value = star_rating_div.get('data-count')
            title_value = star_rating_div.get('title')
        except:
            data_count_value=0
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
            price= price.replace("\n", "")
        except:
            print(price)
        brandName = brandName.replace("\n","")
        try:
            product_details = {
                'product Url': productUrl,
                'Brand Name': brandName,
                'Product Name': productName.text,
                'Price': price,
                'Real Price': originalPrice,
                'Total Reviews': data_count_value,
                'Rating': title_value,
                'Delivery Time': delivery_time_text,
                'Partners': NumOfpartners
            }
            
            product_details_list.append(product_details)
        except:
            pass
    return product_details_list
# print(product_details_list)

@app.route('/getdata')
def getdata1():
    page = request.args.get('page')
    querry = request.args.get('querry')
    return jsonify (getdata(page,querry))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)