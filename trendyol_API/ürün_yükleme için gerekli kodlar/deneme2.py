import psycopg2
import json

def get_product_by_id(product_id, connection):
    # PostgreSQL veritabanından ürünü sorgulama
    cursor = connection.cursor()
    query = "SELECT * FROM products WHERE id = %s;"
    cursor.execute(query, (product_id,))
    product_data = cursor.fetchone()
    cursor.close()
    return product_data

def write_to_json(product_data, file_path):
    # Ürün verisini JSON dosyasına yazma
    with open(file_path, 'w') as json_file:
        json.dump(product_data, json_file, indent=4)

def main():
    # PostgreSQL veritabanı bağlantısı
    connection = psycopg2.connect(
        dbname="postgres",
        user="postgres",
        password="1234",
        host="localhost",
        port="5432"
    )

    # Çekilecek ürünün ID'si
    product_id = "18ab542f6e32ba21348e41c5c8af077a"

    # Ürünü çekme
    product_data = get_product_by_id(product_id, connection)

    # JSON dosyasına yazma
    file_path = 'product_data.json'
    write_to_json(product_data, file_path)

    # Veritabanı bağlantısını kapatma
    connection.close()

if __name__ == "__main__":
    main()
