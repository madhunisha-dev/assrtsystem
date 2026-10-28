
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
            <title>Asset Management System V3</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background: #f1f5f9;
                    color: #1e293b;
                }

                header {
                    background: #172554;
                    color: white;
                    padding: 25px;
                    text-align: center;
                }

                header h1 {
                    margin: 0 0 8px;
                }

                .version {
                    display: inline-block;
                    background: #16a34a;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-weight: bold;
                }

                main {
                    max-width: 1000px;
                    margin: 30px auto;
                    padding: 0 18px;
                }

                .card {
                    background: white;
                    padding: 24px;
                    margin-bottom: 22px;
                    border-radius: 12px;
                    box-shadow: 0 3px 12px #00000010;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 12px;
                }

                input, select, button {
                    width: 100%;
                    padding: 12px;
                    border-radius: 6px;
                    font-size: 15px;
                }

                input, select {
                    border: 1px solid #cbd5e1;
                }

                button {
                    border: none;
                    background: #1d4ed8;
                    color: white;
                    cursor: pointer;
                }

                button:hover {
                    opacity: 0.9;
                }

                .delete-btn {
                    background: #dc2626;
                    padding: 8px 12px;
                }

                .search {
                    margin-bottom: 16px;
                }

                .table-wrap {
                    overflow-x: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                }

                th, td {
                    padding: 13px;
                    text-align: left;
                    border-bottom: 1px solid #e2e8f0;
                }

                th {
                    background: #eaf0ff;
                }

                .count {
                    font-size: 30px;
                    font-weight: bold;
                    color: #1d4ed8;
                }

                #message {
                    margin-top: 12px;
                    font-weight: bold;
                }

                footer {
                    text-align: center;
                    padding: 20px;
                    color: #64748b;
                }
            </style>
        </head>
        <body>
            <header>
                <h1>Asset Management System</h1>
                <p>Register, search and manage your assets</p>
                <span class="version">VERSION 3</span>
            </header>

            <main>
                <section class="card">
                    <h2>Asset Dashboard</h2>
                    <p>Total Registered Assets</p>
                    <div class="count" id="total">0</div>
                </section>

                <section class="card">
                    <h2>Add New Asset</h2>
                    <form id="assetForm">
                        <div class="form-grid">
                            <input id="name" placeholder="Asset Name" required>
                            <input id="category" placeholder="Category" required>
                            <input id="location" placeholder="Location" required>
                            <select id="status" required>
                                <option value="Available">Available</option>
                                <option value="In Use">In Use</option>
                                <option value="Under Maintenance">Under Maintenance</option>
                            </select>
                            <button type="submit">Add Asset</button>
                        </div>
                    </form>
                    <div id="message"></div>
                </section>

                <section class="card">
                    <h2>Asset Inventory</h2>
                    <input class="search" id="search" placeholder="Search by name, category or location">
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Asset Name</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="assetTable"></tbody>
                        </table>
                    </div>
                </section>
            </main>

            <footer>Asset Management System V3 | Node.js + Express + Kubernetes</footer>

            <script>
                const form = document.getElementById('assetForm');
                const message = document.getElementById('message');

                async function loadAssets() {
                    const response = await fetch('/assets');
                    const assets = await response.json();
                    const search = document.getElementById('search').value.toLowerCase();
                    const table = document.getElementById('assetTable');

                    document.getElementById('total').textContent = assets.length;
                    table.replaceChildren();

                    const filtered = assets.filter(asset =>
                        [asset.name, asset.category, asset.location, asset.status]
                            .some(value => String(value ?? '').toLowerCase().includes(search))
                    );

                    filtered.forEach(asset => {
                        const row = document.createElement('tr');

                        [
                            asset.id,
                            asset.name,
                            asset.category,
                            asset.location,
                            asset.status
                        ].forEach(value => {
                            const cell = document.createElement('td');
                            cell.textContent = value ?? '';
                            row.appendChild(cell);
                        });

                        const action = document.createElement('td');
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Delete';
                        deleteButton.className = 'delete-btn';
                        deleteButton.addEventListener('click', () => deleteAsset(asset.id));
                        action.appendChild(deleteButton);
                        row.appendChild(action);
                        table.appendChild(row);
                    });
                }

                form.addEventListener('submit', async event => {
                    event.preventDefault();

                    const asset = {
                        name: document.getElementById('name').value.trim(),
                        category: document.getElementById('category').value.trim(),
                        location: document.getElementById('location').value.trim(),
                        status: document.getElementById('status').value
                    };

                    const response = await fetch('/assets', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(asset)
                    });

                    const result = await response.json();
                    message.textContent = result.message;

                    if (response.ok) {
                        form.reset();
                        await loadAssets();
                    }
                });

                async function deleteAsset(id) {
                    if (!confirm('Delete this asset?')) return;

                    const response = await fetch('/assets/' + id, {
                        method: 'DELETE'
                    });

                    const result = await response.json();
                    message.textContent = result.message;
                    await loadAssets();
                }

                document.getElementById('search').addEventListener('input', loadAssets);

                appInit();

                async function appInit() {
                    await loadAssets();
                }
            </script>
        </body>
        </html>
    `);
});

app.get('/assets', (req, res) => {
    res.json(assets);
});

app.post('/assets', (req, res) => {
    const { name, category, location, status } = req.body;

    if (!name || !category || !location || !status) {
        return res.status(400).json({
            message: 'Please fill in all asset fields'
        });
    }

    const asset = {
        id: nextId++,
        name,
        category,
        location,
        status
    };

    assets.push(asset);

    res.status(201).json({
        message: 'Asset added successfully (v3)',
        asset
    });
});

app.delete('/assets/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = assets.findIndex(asset => asset.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Asset not found'
        });
    }

    assets.splice(index, 1);

    res.json({
        message: 'Asset deleted successfully (v3)'
    });
});

app.listen(3000, () => {
    console.log('Asset Management System V3 running on port 3000');
});
