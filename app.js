
const express = require('express');
const app = express();

app.use(express.json());

let assets = [];
let nextId = 1;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Asset Management System V2</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    background: #f2f5fa;
                }
                h1 { color: #173b70; }
                input, button {
                    padding: 10px;
                    margin: 5px;
                }
                button {
                    background: #173b70;
                    color: white;
                    border: none;
                    cursor: pointer;
                }
                table {
                    width: 100%;
                    margin-top: 20px;
                    border-collapse: collapse;
                    background: white;
                }
                th, td {
                    padding: 12px;
                    border: 1px solid #ddd;
                    text-align: left;
                }
                th { background: #173b70; color: white; }
            </style>
        </head>
        <body>
            <h1>Asset Management System V2</h1>
            <p>Version 2 — Asset Registration and Listing</p>

            <h3>Add New Asset</h3>
            <form id="assetForm">
                <input id="name" placeholder="Asset Name" required>
                <input id="category" placeholder="Category" required>
                <button type="submit">Add Asset</button>
            </form>

            <h3>Registered Assets</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody id="assetTable"></tbody>
            </table>

            <script>
                async function loadAssets() {
                    const response = await fetch('/assets');
                    const data = await response.json();
                    const table = document.getElementById('assetTable');
                    table.replaceChildren();

                    data.forEach(asset => {
                        const row = document.createElement('tr');

                        [asset.id, asset.name, asset.category].forEach(value => {
                            const cell = document.createElement('td');
                            cell.textContent = value ?? '';
                            row.appendChild(cell);
                        });

                        table.appendChild(row);
                    });
                }

                document.getElementById('assetForm').addEventListener('submit', async event => {
                    event.preventDefault();

                    const response = await fetch('/assets', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: document.getElementById('name').value,
                            category: document.getElementById('category').value
                        })
                    });

                    if (response.ok) {
                        event.target.reset();
                        await loadAssets();
                    } else {
                        alert('Unable to add asset');
                    }
                });

                loadAssets();
            </script>
        </body>
        </html>
    `);
});

app.get('/assets', (req, res) => {
    res.json(assets);
});

app.post('/assets', (req, res) => {
    const { name, category } = req.body;

    if (!name || !category) {
        return res.status(400).json({
            message: 'Name and category are required'
        });
    }

    const asset = {
        id: nextId++,
        name,
        category
    };

    assets.push(asset);

    res.status(201).json({
        message: 'Asset added successfully (v2)',
        asset
    });
});

app.listen(3000, () => {
    console.log('Asset System V2 running on port 3000');
});
