const express = require('express');
const app = express();
const port = 3000; // You can choose any available port

// Serve static files from the 'public' directory (in this case, your HTML file)
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const os = require('os');

const { exec } = require('child_process');

app.get('/api/cpu-memory', (req, res) => {
    const cpuUsage = os.loadavg()[0]; // Get CPU usage
    const totalMemory = os.totalmem(); // Get total memory
    const freeMemory = os.freemem();   // Get free memory

    // Calculate memory usage as a percentage
    const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;

    // Execute the command to get CPU temperature
    exec('cat /sys/class/thermal/thermal_zone0/temp', (error, stdout, stderr) => {
        if (error) {
            console.error('Error getting CPU temperature:', error);
            res.status(500).json({ error: 'Failed to get CPU temperature' });
            return;
        }

        const cpuTemperature = parseFloat(stdout) / 1000; // Convert to degrees Celsius

        res.json({
            cpu: cpuUsage.toFixed(2),       // Convert to a fixed number of decimal places
            memory: memoryUsage.toFixed(2), // Convert to a fixed number of decimal places
            temperature: cpuTemperature.toFixed(2) // Convert to a fixed number of decimal places
        });
    });
});
