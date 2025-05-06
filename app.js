const express = require('express');
const videoRoutes = require('./video.route');
const path = require('path');
const {AppDataSource} = require('./db'); // FIXED location
const app = express();
const cors = require('cors');
app.use(express.json());

// Serve static video files
app.use('/download', express.static(path.join(__dirname, 'download')));

//cors
app.use(cors({
    origin: ['http://localhost:5000', 'http://127.0.0.1:5500', 'http://localhost:5000'],
    methods: ['GET', 'POST'],
    credentials: true,
}));

// Routes
app.use('/', videoRoutes);

// Initialize DB and start server
AppDataSource.initialize()
    .then(() => {
        console.log('✅ Data Source has been initialized!');
        app.listen(5000, () => {
            console.log('Server running at http://localhost:5000');
        });
    })
    .catch((err) => {
        console.error('❌ Error during Data Source initialization', err);
    });