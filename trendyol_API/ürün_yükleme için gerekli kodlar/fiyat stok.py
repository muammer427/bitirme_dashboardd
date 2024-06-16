import requests
import base64

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

    # PUT isteği gönderme
    try:
        response = requests.post(endpoint, headers=headers, json=product_data)
        response.raise_for_status()  # Hata durumunda istisna fırlat
        print(f"Product with barcode {product_data['items'][0]['barcode']} successfully updated on Trendyol.")
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        print(f"Response content: {response.content}")
    except Exception as err:
        print(f"Other error occurred: {err}")

# Trendyol API URL'si
url = 'https://api.trendyol.com/sapigw/suppliers/{supplierId}/products/price-and-inventory'

# Trendyol API bilgileri
supplier_id = '917636'
api_key = 'rsBHmEiBBitroVb4yXSt'
api_secret = 'ConmRKqRFud4910EvX4M'

# Güncellenecek ürün verisi (fiyat ve stok adeti)
product_data = {
    "items": [
        {
            "barcode": "8683295111006",
            "salePrice": 112.85,
            "listPrice": 113.85,
            "quantity": 50
        }
    ]
}

# Ürünü güncelleme işlemi
update_product_price_stock(url, supplier_id, api_key, api_secret, product_data)
