import requests
import base64
import json

def update_product_from_file(url, supplier_id, api_key, api_secret, file_path):
    # API anahtarları
    auth_string = f"{api_key}:{api_secret}"
    auth_bytes = auth_string.encode('utf-8')
    auth_base64 = base64.b64encode(auth_bytes).decode('utf-8')

    # Endpoint URL
    endpoint = url.format(supplierid=supplier_id)

    # Başlık
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Basic {auth_base64}'
    }

    # JSON dosyasını oku
    with open(file_path, 'r') as file:
        product_data = json.load(file)

    # PUT isteği gönderme (veya POST, Trendyol'un belgelerine göre)
    try:
        response = requests.put(endpoint, headers=headers, json=product_data)
        response.raise_for_status()  # Hata durumunda istisna fırlat
        print(f"Product with barcode {product_data['items'][0]['barcode']} successfully updated on Trendyol.")
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        print(f"Response content: {response.content}")
    except Exception as err:
        print(f"Other error occurred: {err}")


# Trendyol API URL'si
url = 'https://api.trendyol.com/sapigw/suppliers/{supplierid}/v2/products'

# Trendyol API bilgileri
supplier_id = '917636'
api_key = 'rsBHmEiBBitroVb4yXSt'
api_secret = 'ConmRKqRFud4910EvX4M'

# JSON dosya yolu
file_path = 'backend/products.json'

# Ürünü güncelleme işlemi
update_product_from_file(url, supplier_id, api_key, api_secret, file_path)
