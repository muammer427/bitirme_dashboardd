# veri tabanı ürün çekme
import psycopg2
import json

# PostgreSQL connection parameters
conn_params = {
    "host": "localhost",
    "database": "postgres",
    "user": "postgres",
    "password": "1234"
}

# Function to fetch products from database and write to JSON file
def export_products_to_json():
    try:
        # Connect to PostgreSQL
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor()

        # Query to fetch products
        query = "SELECT * FROM product"
        cursor.execute(query)

        # Fetch all rows
        rows = cursor.fetchall()

        # Define the structure of items
        items = []
        for row in rows:
            item = {
                "barcode": row[2] if row[2] else "",  # Assuming barcode is in the 3rd column (index 2)
                "title": row[3] if row[3] else "",    # Assuming title is in the 4th column (index 3)
                "productMainId": str(row[5]) if row[5] is not None else "",  # Assuming productcode is in the 6th column (index 5)
                "brandId": row[6] if row[6] else "",   # Assuming brand is in the 7th column (index 6)
                "categoryId": row[15] if row[15] else "",  # Assuming category is in the 16th column (index 15)
                "quantity": int(row[7]) if row[7] is not None else 0,  # Assuming stock is in the 8th column (index 7)
                "stockCode": row[8] if row[8] else "",  # Assuming desi is in the 9th column (index 8)
                "dimensionalWeight": float(row[11]) if row[11] is not None else 0.0,  # Assuming listprice is in the 12th column (index 11)
                "description": row[4] if row[4] else "",  # Assuming description is in the 5th column (index 4)
                "currencyType": row[9] if row[9] else "",  # Assuming currency is in the 10th column (index 9)
                "listPrice": float(row[10]) if row[10] is not None else 0.0,  # Assuming listprice is in the 11th column (index 10)
                "salePrice": float(row[12]) if row[12] is not None else 0.0,  # Assuming saleprice is in the 13th column (index 12)
                "vatRate": float(row[13]) if row[13] is not None else 0.0,  # Assuming vatrate is in the 14th column (index 13)
                "cargoCompanyId": row[14] if row[14] else "",  # Assuming cargo is in the 15th column (index 14)
                "images": [{"url": row[1]}] if row[1] else []  # Assuming img is in the 2nd column (index 1)
            }
            items.append(item)

        # Close cursor and connection
        cursor.close()
        conn.close()

        # Write to JSON file
        with open('products.json', 'w') as json_file:
            json.dump({"items": items}, json_file, indent=2)

        print("Products exported to products.json")

    except (Exception, psycopg2.Error) as error:
        print("Error exporting products:", error)

# Run the function to export products to JSON
export_products_to_json()
