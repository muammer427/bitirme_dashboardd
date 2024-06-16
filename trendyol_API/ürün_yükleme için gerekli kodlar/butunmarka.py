import requests

def get_all_brands():
    url = "https://api.trendyol.com/sapigw/brands"
    params = {"page": 1, "size": 1000}  # Adjust page and size as needed
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        return {brand['id']: brand['name'] for brand in data['brands']}
    else:
        print("Error:", response.status_code)
        return {}

# Retrieve all brands with their IDs and names
all_brands = get_all_brands()

# Print all brands with their IDs and names
for brand_id, brand_name in all_brands.items():
    print("Brand ID:", brand_id)
    print("Brand Name:", brand_name)
    print("--------------------")
