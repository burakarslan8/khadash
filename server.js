const express = require('express');
const app = express();
const port = 3000; // You can choose any available port
const bodyParser = require('body-parser');
const { exec } = require('child_process');

app.use(express.static('public'));
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const os = require('os');

app.get('/api/cpu-memory', (req, res) => {
    const cpuUsage = os.loadavg()[0];
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();

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
            temperature: cpuTemperature.toFixed(2) // Convert to a fixed number of decimal places
        });
    });
});

function executeFanCommand(fanMode, command, callback) {
    if(fanMode==='manual'){
        exec(`fan.sh ${fanMode}; fan.sh ${command}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing fan.sh ${command}:`, error);
                callback(false);
            } else {
                console.log(`Fan mode and speed set to ${command}`);
                callback(true);
            }
        });
    }else{
        exec(`fan.sh ${command}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing fan.sh ${command}:`, error);
                callback(false);
            } else {
                console.log(`Fan mode and speed set to ${command}`);
                callback(true);
            }
        });
    }
}


let currentFanMode = 'auto'; // Default to 'auto'
let currentFanSpeed = 'low';

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

app.get('/api/get-fan-speed', (req, res) => {
    res.json({ speed: currentFanSpeed });
});

app.post('/api/set-fan', (req, res) => {
    const { mode, speed } = req.body;

    let command = '';

    if (mode === 'auto') {
        command = 'auto';
        currentFanMode = 'auto'; // Update the current fan mode
    } else if (mode === 'manual') {
        if (speed === 'low' || speed === 'mid' || speed === 'high') {
            command = speed;
            currentFanMode = 'manual'; // Update the current fan mode
        } else {
            res.status(400).json({ error: 'Invalid speed for manual mode' });
            return;
        }
    } else {
        res.status(400).json({ error: 'Invalid fan mode' });
        return;
    }

    executeFanCommand(currentFanMode, command, success => {
        if (success) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Failed to set fan mode and speed' });
        }
    });
});