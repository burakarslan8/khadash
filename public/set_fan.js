
const toggleMode = document.getElementById('auto-manual-toggle');

toggleMode.addEventListener('change', () => {
    if (toggleMode.checked) {
        // Auto mode is selected
        console.log('Auto mode selected');
        // Add logic for auto mode here
        setFanModeAndSpeed('auto', 'low');
    } else {
        // Manual mode is selected
        console.log('Manual mode selected');
        // Add logic for manual mode here
        setFanModeAndSpeed('manual', 'low');
    }
});

document.querySelectorAll('input[name="fan-speed"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        const fanSpeed = this.value;
        var fanMode = 'auto';
        if(toggleMode.checked){
            fanMode='auto';
        }else{
            fanMode='manual';
        }
        
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