import requests

def get_brand_id_by_name(brand_name):
    url = "https://api.trendyol.com/sapigw/brands/by-name"
    params = {"name": brand_name}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data:
            return data[0]['id'], data[0]['name']
        else:
            return None, None
    else:
        print("Error:", response.status_code)
        return None, None

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


brand_name = "TRENDYOLMİLLA"
brand_id, brand_name = get_brand_id_by_name(brand_name)
print("Brand ID:", brand_id)
print("Brand Name:", brand_name)