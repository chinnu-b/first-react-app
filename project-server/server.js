//start server.js code
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;
const dbConfig = require('./utils/database');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send(`Server running on port ${PORT}`));
app.get('/photo/:photo', (req, res) => res.sendFile(__dirname + '/uploads/' + req.params.photo));


dbConfig.connectToDB().then((db) => {
    app.use('/api', require('./routes/api.controller'));
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
}).catch((err) => console.error('Database connection error', err));

//end server.js code