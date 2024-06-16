import requests

def get_all_categories():
    url = "https://api.trendyol.com/sapigw/product-categories"
    response = requests.get(url)
    if response.status_code == 200:
        categories = response.json()
        return extract_categories(categories.get("categories", []))
    else:
        print("Failed to retrieve category data.")
        return None

def extract_categories(categories):
    category_info = []
    for category in categories:
        category_id = category.get("id")
        category_name = category.get("name")
        category_info.append({"id": category_id, "name": category_name})
        if category.get("subCategories"):
            sub_category_info = extract_categories(category.get("subCategories", []))
            category_info.extend(sub_category_info)
    return category_info

# Example usage
all_categories = get_all_categories()
if all_categories:
    print("All Categories:")
    for category in all_categories:
        print(f"ID: {category['id']}, Name: {category['name']}")
else:
    print("Failed to retrieve category data.")
