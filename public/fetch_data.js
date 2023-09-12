function fetchData() {
    fetch('/api/general-info')
        .then(response => response.json())
        .then(data => {
            document.getElementById('cpu-usage').textContent = `${data.cpu}%`;
            document.getElementById('memory-usage').textContent = `${data.memory}%`;
            document.getElementById('cpu-temperature').textContent = `${data.temperature}°C`;
            document.getElementById('uptime').textContent = `${data.uptime}`;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Fetch data initially
fetchData();

// Fetch data every 3 seconds
setInterval(fetchData, 1000);
