import requests
from bs4 import BeautifulSoup
import pandas as pd

def get_wildfire_data():
    url = "https://www.fire.ca.gov/incidents/"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    fires = []
    for row in soup.select('table.incident-list tbody tr'):
        columns = row.find_all('td')
        if len(columns) >= 5:
            name = columns[0].text.strip()
            county = columns[1].text.strip()
            acres = columns[2].text.strip().replace(',', '')
            containment = columns[3].text.strip()
            fires.append({
                'Name': name,
                'County': county,
                'Acres': int(acres) if acres.isdigit() else 0,
                'Containment': containment
            })
    
    return pd.DataFrame(fires)

def generate_html(df):
    html_content = """
    <h2>Largest Active Wildfires in California</h2>
    <table>
      <tr>
        <th>Name</th>
        <th>County</th>
        <th>Acres</th>
        <th>Containment</th>
      </tr>
    """
    
    for _, row in df.nlargest(5, 'Acres').iterrows():
        html_content += f"""
        <tr>
          <td>{row['Name']}</td>
          <td>{row['County']}</td>
          <td>{row['Acres']:,}</td>
          <td>{row['Containment']}</td>
        </tr>
        """
    
    html_content += "</table>"
    
    with open('wildfires.html', 'w') as f:
        f.write(html_content)

if __name__ == "__main__":
    wildfire_data = get_wildfire_data()
    generate_html(wildfire_data)
