from selectolax.parser import HTMLParser
import json
import requests
from decouple import config
SECRET_KEY = config('api_key')

def parse_html(html: HTMLParser) -> dict:
    for script in html.css('script[type="application/ld+json"]'):
        try:
            schema = json.loads(script.text())
            
            # Check if it's a single object
            if isinstance(schema, dict):
                if schema.get('@type') == 'Product':
                    print('schema: ', schema)
                    return schema
            
            # Check if it's a list of objects
            elif isinstance(schema, list):
                for item in schema:
                    if isinstance(item, dict) and item.get('@type') == 'Product':
                        print('item: ', item)
                        return item
        
        except json.JSONDecodeError:
            print('json.JSONDecodeError: ', json.JSONDecodeError)
            continue  # Skip invalid JSON
    
    return {}  # Return an empty dict if no product schema is found


def get_data(get_url: str) -> dict:
    response = requests.get(
        url='https://app.scrapingbee.com/api/v1/',
        params={
        'api_key': '2Q074DCN8MFS6AVXXMRBUATBKS52AF0QBYI6S85HE5KIPJGEL4U2LWVQN1P68V7A05A0RZY7C4564E1D',
        'url': get_url, 
        'wait_browser':'load',
        "render_js": "true",
        }, 
        headers = {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"}
        )
    request_data = HTMLParser(response.text)
    return parse_html(request_data)


def extract_product_info(product):
    # Initialize a dictionary to hold the product info
    product_info = {}
    
    # Extract title
    product_info['title'] = product.get('name', None)
    
    # Extract description
    product_info['description'] = product.get('description', None)
    
    # Extract brand
    brand = product.get('brand', None)
    if isinstance(brand, dict):
        product_info['brand'] = brand.get('name', None)
    else:
        product_info['brand'] = brand
        
    # Extract price
    offers = product.get('offers', {})
    if isinstance(offers, list):
        # If offers is a list, take the first offer
        offer = offers[0]
    else:
        # Otherwise, assume offers is a dictionary
        offer = offers
    product_info['price'] = offer.get('price', None)
    
    # Extract image URL
    image = product.get('image', None)
    if isinstance(image, list):
        # If image is a list, take the first image
        product_info['image_url'] = image[0]
    else:
        # Otherwise, assume image is a string
        product_info['image_url'] = image
    
    # extract product url
    product_info['product_url'] = offer.get('url', None)

    # extract product size
    product_info['size'] = product.get('size', None)
    
    return product_info
