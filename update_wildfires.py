import requests
from bs4 import BeautifulSoup
import json

def get_wildfire_data():
    url = "https://www.fire.ca.gov/incidents/"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    fires = []
    for row in soup.select('table.incident-list tbody tr'):
        columns = row.find_all('td')
        if len(columns) >= 5:
            name = columns[0].text.strip()
            acres = columns[2].text.strip().replace(',', '')
            containment = columns[3].text.strip()
            fires.append({
                'Name': name,
                'Acres': int(acres) if acres.isdigit() else 0,
                'Containment': containment
            })
    
    return sorted(fires, key=lambda x: x['Acres'], reverse=True)[:5]

def generate_json(data):
    with open('wildfire_data.json', 'w') as f:
        json.dump(data, f)

if __name__ == "__main__":
    wildfire_data = get_wildfire_data()
    generate_json(wildfire_data)
