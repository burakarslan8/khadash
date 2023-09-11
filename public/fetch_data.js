function fetchData() {
    fetch('/api/cpu-memory')
        .then(response => response.json())
        .then(data => {
            document.getElementById('cpu-usage').textContent = `${data.cpu}%`;
            document.getElementById('memory-usage').textContent = `${data.memory}%`;
            document.getElementById('cpu-temperature').textContent = `${data.temperature}°C`;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Fetch data initially
fetchData();

// Fetch data every 3 seconds
setInterval(fetchData, 1000);
