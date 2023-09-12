
const toggleMode = document.getElementById('auto-manual-toggle');

fetch('/api/get-fan-mode')
    .then(response => response.json())
    .then(data => {
        // Set the initial UI state based on the current fan mode
        if (data.mode === 'auto') {
            toggleMode.checked = true;
        } else {
            toggleMode.checked = false;
        }
    })
    .catch(error => {
        console.error('Error fetching fan mode:', error);
    });

toggleMode.addEventListener('change', () => {
    if (toggleMode.checked) {
        // Auto mode is selected
        console.log('Auto mode selected');
        // Add logic for auto mode here
        setFanMode('auto', null);
    } else {
        // Manual mode is selected
        console.log('Manual mode selected');
        // Add logic for manual mode here
        setFanMode('manual');
    }
});

// Function to send fan mode and speed to the server
function setFanMode(mode) {
    fetch('/api/set-fan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({mode})
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Fan mode and speed set successfully.');
            } else {
                console.error('Failed to set fan mode and speed.');
            }
        })
        .catch(error => {
            console.error('Error setting fan mode and speed:', error);
        });
}