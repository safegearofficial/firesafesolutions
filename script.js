const CACHE_KEY = 'wildfireData';
const CACHE_TIME_KEY = 'wildfireDataTimestamp';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

async function fetchWildfireData() {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    const now = Date.now();

    if (cachedData && cachedTime && (now - cachedTime < CACHE_DURATION)) {
        // Use cached data
        return JSON.parse(cachedData);
    } else {
        // Fetch new data from NIFC API
        const endpoint = 'https://opendata.arcgis.com/datasets/nifc::wildfire-perimeters-public.geojson';
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();

        // Update cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, now.toString());

        return data;
    }
}

async function displayWildfireData() {
    try {
        const data = await fetchWildfireData();
        const californiaFires = data.features.filter(fire =>
            fire.properties.state === 'CA' // Ensure the fires are in California
        );

        const tableBody = document.getElementById('wildfire-data');
        tableBody.innerHTML = '';

        if (californiaFires.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3">No active wildfires in California</td></tr>';
            return;
        }

        californiaFires.forEach(fire => {
            const properties = fire.properties;
            const row = `
                <tr>
                    <td>${properties.fire_name || 'Unknown'}</td>
                    <td>${properties.fire_size ? properties.fire_size.toLocaleString() : 'N/A'}</td>
                    <td>${properties.percent_contained || 'N/A'}%</td>
                </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error displaying wildfire data:', error);
        document.getElementById('wildfire-data').innerHTML = '<tr><td colspan="3">Error loading data</td></tr>';
    }
}

// Initialize data display
displayWildfireData();
