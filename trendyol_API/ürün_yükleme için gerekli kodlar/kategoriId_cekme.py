import requests

def get_category_id(category_name):
    url = "https://api.trendyol.com/sapigw/product-categories"
    response = requests.get(url)
    if response.status_code == 200:
        categories = response.json()
        return find_category_id(categories.get("categories", []), category_name)
    else:
        print("Failed to retrieve category data.")
        return None

def find_category_id(categories, category_name):
    for category in categories:
        if category.get("name") == category_name:
            return category.get("id")
        if category.get("subCategories"):
            sub_category_id = find_category_id(category.get("subCategories", []), category_name)
            if sub_category_id:
                return sub_category_id
    return None


category_name = "Telefon"  
category_id = get_category_id(category_name)
if category_id:
    print(f"The category ID for '{category_name}' is: {category_id}")
else:
    print(f"Category '{category_name}' not found.")
