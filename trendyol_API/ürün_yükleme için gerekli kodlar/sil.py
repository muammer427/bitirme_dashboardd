import requests
import base64

def delete_product(url, supplier_id, api_key, api_secret, product_barcode):
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

    # İstek verisi
    payload = {
        "items": [
            {
                "barcode": product_barcode
            }
        ]
    }

    # DELETE isteği gönderme
    try:
        response = requests.delete(endpoint, headers=headers, json=payload)
        response.raise_for_status()  # Hata durumunda istisna fırlat
        print(f"Product with barcode {product_barcode} successfully deleted from Trendyol.")
        print(f"Response: {response.json()}")
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        print(f"Response: {response.json()}")
    except Exception as err:
        print(f"Other error occurred: {err}")

# Trendyol API URL'si
url = 'https://api.trendyol.com/sapigw/suppliers/{supplierid}/v2/products'

# Trendyol API bilgileri
supplier_id = '917636'
api_key = 'rsBHmEiBBitroVb4yXSt'
api_secret = 'ConmRKqRFud4910EvX4M'

# Ürün barkodu
product_barcode = 'barkod-123456'  # Silmek istediğiniz ürünün barkod bilgisi

# Ürünü silme işlemi
delete_product(url, supplier_id, api_key, api_secret, product_barcode)

