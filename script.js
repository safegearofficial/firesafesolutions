// API URL for live wildfire data
const apiUrl = 'https://incidents.fire.ca.gov/umbraco/api/IncidentApi/List?inactive=true';
const useCorsProxy = true; // Set to true if CORS issues occur

const fetchUrl = useCorsProxy
    ? `https://cors-anywhere.herokuapp.com/${apiUrl}`
    : apiUrl;

// Fetch and display wildfire data
async function fetchWildfireData() {
    try {
        const response = await fetch(fetchUrl, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const tableBody = document.getElementById('wildfire-data');
        tableBody.innerHTML = ''; // Clear old rows

        if (data && data.length > 0) {
            data.forEach(fire => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${fire.Name || 'N/A'}</td>
                    <td>${fire.Counties || 'N/A'}</td>
                    <td>${fire.AcresBurned || '0'} acres</td>
                    <td>${fire.PercentContained || '0'}%</td>
                    <td>${fire.LastUpdated ? new Date(fire.LastUpdated).toLocaleString() : 'N/A'}</td>
                `;
                tableBody.appendChild(row);
            });

            document.getElementById('wildfire-table').style.display = 'table';
            document.getElementById('loading').style.display = 'none';
        } else {
            document.getElementById('loading').textContent = 'No active wildfires found.';
        }
    } catch (error) {
        console.error('Error fetching wildfire data:', error);
        document.getElementById('loading').textContent = 'Failed to load wildfire data. Please try again later.';
    }
}

// Update time zones
function updateTime() {
    const now = new Date();
    document.getElementById('time-la').textContent = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
    document.getElementById('time-chi').textContent = now.toLocaleString('en-US', { timeZone: 'America/Chicago' });
    document.getElementById('time-ny').textContent = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
}

// Initial data load
fetchWildfireData();
updateTime();

// Set intervals for updates
setInterval(fetchWildfireData, 600000); // Update wildfire data every 10 minutes
setInterval(updateTime, 1000); // Update time every second
