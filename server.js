const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // To parse JSON requests

// Create MySQL Connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Ra@210804',
    database: 'cafe_shop'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL connected...');
});

// // Endpoint to save order
// app.post('/api/orders', (req, res) => {
//     const { name, items } = req.body; // Expecting { name: 'Customer Name', items: [] }

//     items.forEach(item => {
//         const query = 'INSERT INTO orders (name, item, quantity, price) VALUES (?, ?, ?, ?)';
//         db.query(query, [name, item.name, item.quantity, item.price], (err, results) => {
//             if (err) {
//                 res.status(500).json({ error: 'Error saving order' });
//                 return;
//             }
//         });
//     });

//     res.status(200).json({ message: 'Order saved successfully' });
// });
app.post('/api/orders', (req, res) => {
    const { name, items } = req.body; // Expecting { name: 'Customer Name', items: [] }

    if (!name || !items || items.length === 0) {
        return res.status(400).json({ error: 'Invalid request data' });
    }

    // To handle errors and responses properly use a counter
    let errors = 0;

    items.forEach(item => {
        const query = 'INSERT INTO orders (name, item, quantity, price) VALUES (?, ?, ?, ?)';

        // Here we need to check for errors in each query
        db.query(query, [name, item.name, item.quantity, item.price], (err, results) => {
            if (err) {
                console.error('Error saving order', err);
                errors++;
            }

            // Check if this is the last item
            if (errors === 0 && item === items[items.length - 1]) {
                return res.status(200).json({ message: 'All orders saved successfully' });
            }
            else if (errors > 0 && item === items[items.length - 1]) {
                return res.status(500).json({ error: 'Some orders failed to save' });
            }
        });
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


