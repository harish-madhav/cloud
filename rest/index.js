const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Sample data array
let data = [
    { "name": "Arjun Tripathi", "course": "MCA", "roll_no": "14", "id": 1 },
    { "name": "Rahul Durgapal", "course": "MCA", "roll_no": "36", "id": 2 },
    { "name": "Aman Yadav", "course": "MCA", "roll_no": "08", "id": 3 }
];

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // Serve static files from the /public directory

// REST API routes

// Get all data
app.get('/api', (req, res) => {
    res.status(200).json(data);
});

// Get data by ID
app.get('/api/:id', (req, res) => {
    let found = data.find(item => item.id === parseInt(req.params.id));
    if (found) {
        res.status(200).json(found);
    } else {
        res.sendStatus(404);
    }
});

// Create a new entry
app.post('/api', (req, res) => {
    let newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
    let newItem = {
        id: newId,
        name: req.body.name,
        course: req.body.course,
        roll_no: req.body.roll_no
    };
    data.push(newItem);
    res.status(201).json({ 'message': "Successfully created" });
});

// Update an entry by ID
app.put('/api/:id', (req, res) => {
    let found = data.find(item => item.id === parseInt(req.params.id));
    if (found) {
        let updateData = {
            id: found.id,
            name: req.body.name,
            course: req.body.course,
            roll_no: req.body.roll_no
        };
        let targetIndex = data.indexOf(found);
        data.splice(targetIndex, 1, updateData);
        res.status(201).json({ 'message': "Data updated" });
    } else {
        res.status(404).json({ 'message': 'Data not found' });
    }
});

// Patch an entry by ID
app.patch('/api/:id', (req, res) => {
    let found = data.find(item => item.id === parseInt(req.params.id));
    if (found) {
        if (req.body.name) found.name = req.body.name;
        if (req.body.course) found.course = req.body.course;
        if (req.body.roll_no) found.roll_no = req.body.roll_no;
        res.status(201).json({ "message": "Data updated" });
    } else {
        res.status(404).json({ 'message': 'Data not found' });
    }
});

// Delete an entry by ID
app.delete('/api/:id', (req, res) => {
    let found = data.find(item => item.id === parseInt(req.params.id));
    if (found) {
        let targetIndex = data.indexOf(found);
        data.splice(targetIndex, 1);
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at: http://localhost:${port}`);
});
