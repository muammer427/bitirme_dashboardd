# fiyat stok çekme veri tabanı
import psycopg2
import json

# PostgreSQL bağlantı parametreleri
conn_params = {
    "host": "localhost",
    "database": "postgres",
    "user": "postgres",
    "password": "1234"
}

# Veritabanından ürünleri çekip JSON dosyasına yazan fonksiyon
def export_products_to_json():
    try:
        # PostgreSQL'e bağlan
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor()

        # Ürünleri çekmek için sorgu
        query = "SELECT barcode, saleprice, listprice, stock FROM product"
        cursor.execute(query)

        # Tüm satırları çek
        rows = cursor.fetchall()

        # Ürün verileri yapılandır
        items = []
        for row in rows:
            item = {
                "barcode": row[0] if row[0] else "",  # barcode 1. sütun (index 0)
                "salePrice": float(row[1]) if row[1] is not None else 0.0,  # saleprice 2. sütun (index 1)
                "listPrice": float(row[2]) if row[2] is not None else 0.0,  # listprice 3. sütun (index 2)
                "quantity": int(row[3]) if row[3] is not None else 0  # stock 4. sütun (index 3)
            }
            items.append(item)

        # Cursor ve bağlantıyı kapat
        cursor.close()
        conn.close()

        # JSON dosyasına yaz
        product_data = {"items": items}
        with open('products1.json', 'w') as json_file:
            json.dump(product_data, json_file, indent=2)

        print("Ürünler products.json dosyasına aktarıldı")

    except (Exception, psycopg2.Error) as error:
        print("Ürünleri aktarırken hata oluştu:", error)

# Ürünleri JSON'a aktarma fonksiyonunu çalıştır
export_products_to_json()
