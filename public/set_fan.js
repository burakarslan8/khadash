document.querySelectorAll('input[name="fan-mode"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        const fanMode = this.value;
        const fanSpeed = document.querySelector('input[name="fan-speed"]:checked').value;
        setFanModeAndSpeed(fanMode, fanSpeed);
    });
});

document.querySelectorAll('input[name="fan-speed"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        const fanSpeed = this.value;
        const fanMode = document.querySelector('input[name="fan-mode"]:checked').value;
        setFanModeAndSpeed(fanMode, fanSpeed);
    });
});

// Function to send fan mode and speed to the server
function setFanModeAndSpeed(mode, speed) {
    fetch('/api/set-fan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mode, speed })
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