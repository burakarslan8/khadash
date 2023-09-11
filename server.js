const express = require('express');
const app = express();
const port = 3000; // You can choose any available port

// Serve static files from the 'public' directory (in this case, your HTML file)
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
