import requests
import base64
import json

def update_product_price_stock(url, supplier_id, api_key, api_secret, product_data):
    # API anahtarları
    auth_string = f"{api_key}:{api_secret}"
    auth_bytes = auth_string.encode('utf-8')
    auth_base64 = base64.b64encode(auth_bytes).decode('utf-8')

    # Endpoint URL
    endpoint = url.format(supplierId=supplier_id)

    # Başlık
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Basic {auth_base64}'
    }

    # POST isteği gönderme
    try:
        response = requests.post(endpoint, headers=headers, json=product_data)
        response.raise_for_status()  # Hata durumunda istisna fırlat
        for item in product_data['items']:
            print(f"Product with barcode {item['barcode']} successfully updated on Trendyol.")
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        print(f"Response content: {response.content}")
    except Exception as err:
        print(f"Other error occurred: {err}")

def load_product_data_from_json(file_path):
    try:
        with open(file_path, 'r') as json_file:
            data = json.load(json_file)
            return data
    except Exception as err:
        print(f"Error reading JSON file: {err}")
        return None

# Trendyol API URL'si
url = 'https://api.trendyol.com/sapigw/suppliers/{supplierId}/products/price-and-inventory'

# Trendyol API bilgileri
supplier_id = '917636'
api_key = 'rsBHmEiBBitroVb4yXSt'
api_secret = 'ConmRKqRFud4910EvX4M'

# JSON dosyasının yolu
json_file_path = 'products1.json'

# JSON dosyasından ürün verilerini yükleme
product_data = load_product_data_from_json(json_file_path)

if product_data:
    # Ürünü güncelleme işlemi
    update_product_price_stock(url, supplier_id, api_key, api_secret, product_data)
