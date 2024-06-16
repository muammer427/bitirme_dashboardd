import requests
import base64
import json
import psycopg2

# Trendyol API anahtarları
API_KEY = 'rsBHmEiBBitroVb4yXSt'
API_SECRET = 'ConmRKqRFud4910EvX4M'

# Temel kimlik doğrulaması için base64 kodlama
auth_string = f"{API_KEY}:{API_SECRET}"
auth_bytes = auth_string.encode('utf-8')
auth_base64 = base64.b64encode(auth_bytes).decode('utf-8')

# Trendyol API URL'si (Doğru URL ve Supplier ID kullanın)
supplier_id = '917636'
url = f'https://api.trendyol.com/sapigw/suppliers/{supplier_id}/products'

# HTTP istek başlıkları
headers = {
    'Authorization': f'Basic {auth_base64}',
    'Content-Type': 'application/json'
}

# PostgreSQL bağlantı bilgileri
db_config = {
    'host': 'localhost',
    'database': 'postgres',
    'user': 'postgres',
    'password': '1234'
}

# Tablo oluşturma SQL kodu
create_table_sql = """
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY,
    data JSONB
);
"""

def create_table():
    try:
        connection = psycopg2.connect(**db_config)
        cursor = connection.cursor()

        # Tablo oluşturma SQL kodunu çalıştır
        cursor.execute(create_table_sql)

        connection.commit()
        print("Table 'products' successfully created.")
    except psycopg2.Error as e:
        print("Error while connecting to PostgreSQL:", e)
    finally:
        if 'connection' in locals():
            connection.close()

def fetch_products():
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Bu, HTTP hata kodları için bir istisna fırlatır
        return True, response
    except requests.exceptions.HTTPError as http_err:
        if response.status_code == 503:
            print("Service Unavailable (503). Please try again later.")
        else:
            print(f"HTTP error occurred: {http_err}")
        return False, None
    except Exception as err:
        print(f"Other error occurred: {err}")
        return False, None

def save_products_to_db(products):
    try:
        connection = psycopg2.connect(**db_config)
        cursor = connection.cursor()

        # Ürünleri veritabanına ekleyin
        for product in products:
            cursor.execute("INSERT INTO products (id, data) VALUES (%s, %s)",
                           (product['id'], json.dumps(product)))

        connection.commit()
        print("Products successfully saved to the database.")
    except psycopg2.Error as e:
        print("Error while connecting to PostgreSQL:", e)
    finally:
        if 'connection' in locals():
            connection.close()

# Tablo oluşturma işlemini gerçekleştir
create_table()

# Ürünleri al ve veritabanına kaydet
success, response = fetch_products()
if success:
    products = response.json()['content']
    save_products_to_db(products)
else:
    print("Failed to fetch products. Check the error messages.")
