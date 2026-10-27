const express = require('express');
const app = express();
app.use(express.json());

let assets = [];

// v1 Feature: Add Asset - Store item
app.post('/assets', (req, res) => {
    const asset = req.body;
    assets.push(asset);
    res.status(201).json({ message: 'Asset added successfully (v1)', asset });
});

app.listen(3000, () => console.log('v1 Running on port 3000'));