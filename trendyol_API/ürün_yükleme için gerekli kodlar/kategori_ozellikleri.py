import requests

# Kategori ID'si
category_id = 5250

# Trendyol API endpoint'i
endpoint = f"https://api.trendyol.com/sapigw/product-categories/{category_id}/attributes"

# GET isteği yap
response = requests.get(endpoint)

# Yanıtı kontrol et
if response.status_code == 200:
    # Yanıtı JSON formatına çevir
    data = response.json()
    
    # Kategori özelliklerini al
    category_attributes = data.get("categoryAttributes", [])
    
    # Özelliklerin listesini oluştur
    for attribute in category_attributes:
        print("Attribute ID:", attribute["attribute"]["id"])
        print("Attribute Name:", attribute["attribute"]["name"])
        print("Attribute Values:")
        for value in attribute["attributeValues"]:
            print("- Value ID:", value["id"])
            print("- Value Name:", value["name"])
            print("------")
else:
    print("Hata:", response.status_code)
