const express = require('express');
const app = express();
const port = 1024; // You can choose any available port
const bodyParser = require('body-parser');
const { exec } = require('child_process');

app.use(express.static('public'));
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const os = require('os');

function formatUptime(uptimeInSeconds) {
    const hours = Math.floor(uptimeInSeconds / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = Math.round(uptimeInSeconds % 60);

    // Use padStart to ensure each part has two digits (e.g., 01 instead of 1)
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

app.get('/api/general-info', (req, res) => {
    const cpuUsage = os.loadavg()[0];
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const uptime = os.uptime();

    // Calculate memory usage as a percentage
    const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;

    // Execute the command to get CPU temperature
    exec('cat /sys/class/thermal/thermal_zone0/temp', (error, stdout, stderr) => {
        if (error) {
            console.error('Error getting CPU temperature:', error);
            res.status(500).json({ error: 'Failed to get CPU temperature' });
            return;
        }

        const cpuTemperature = parseFloat(stdout) / 1000; // Convert to Celsius

        res.json({
            cpu: cpuUsage.toFixed(2),       // Convert to a fixed number of decimal places
            memory: memoryUsage.toFixed(2), // Convert to a fixed number of decimal places
            temperature: cpuTemperature.toFixed(2), // Convert to a fixed number of decimal places
            uptime: formatUptime(uptime)
        });
    });
});

function executeFanCommand(command, callback) {
    exec(`fan.sh ${command}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing /usr/src/khadash/fan.sh ${command}:`, error);
            console.error('stderr:', stderr); // Log standard error
            callback(false);
        } else {
            console.log(`Fan mode set to ${command}`);
            console.log('stdout:', stdout); // Log standard output
            callback(true);
        }
    });
}


let currentFanMode = 'auto'; // Default to 'auto'

app.get('/api/get-fan-mode', (req, res) => {
    // Execute the command to get the current fan mode from your Khadas device
    exec('fan.sh mode', (error, stdout, stderr) => {
        if (error) {
            console.error('Error getting fan mode:', error);
            res.status(500).json({ error: 'Failed to get fan mode' });
            return;
        }

        // Parse the fan mode from the output
        const fanMode = stdout.match(/Fan mode: (.+)/);

        if (fanMode && fanMode[1]) {
            // Trim any extra whitespace from the fan mode
            const trimmedFanMode = fanMode[1].trim();

            // Determine whether the mode is "auto" or "manual"
            const currentFanMode = trimmedFanMode.toLowerCase() === 'auto' ? 'auto' : 'manual';

            res.json({ mode: currentFanMode });
        } else {
            console.error('Failed to parse fan mode:', stdout);
            res.status(500).json({ error: 'Failed to parse fan mode' });
        }
    });
});

app.post('/api/set-fan-mode', (req, res) => {
    const {mode} = req.body;

    let command = '';

    command=mode;
    currentFanMode=mode;

    executeFanCommand(command, success => {
        if (success) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Failed to set fan mode' });
        }
    });
});