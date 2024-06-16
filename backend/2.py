# json dosyasını trendyola yükleme
import requests
import json

def create_products(url, supplier_id, api_key, api_secret, user_agent, product_data):
    headers = {
        'User-Agent': user_agent,
        'Content-Type': 'application/json'
    }
    auth = (api_key, api_secret)
    endpoint = url.format(supplierid=supplier_id)
    response = requests.post(endpoint, auth=auth, headers=headers, json=product_data)
    return response

# Trendyol API endpoint URL
url = 'https://api.trendyol.com/sapigw/suppliers/{supplierid}/v2/products'

# Trendyol API bilgileri
supplier_id = 917636
api_key = 'rsBHmEiBBitroVb4yXSt'
api_secret = 'ConmRKqRFud4910EvX4M'

# Entegrasyon bilgileri
user_agent = '917636 - SelfIntegration'

# JSON dosyasından ürün verisini oku
with open('products.json', 'r', encoding='utf-8') as json_file:
    product_data = json.load(json_file)

response = create_products(url, supplier_id, api_key, api_secret, user_agent, product_data)

if response.status_code == 200:
    print("Ürünler başarıyla oluşturuldu!")
    print("Response:", response.json())
else:
    print("Ürün oluşturma işlemi başarısız oldu.")
    print("Hata kodu:", response.status_code)
    print("Hata mesajı:", response.text)
