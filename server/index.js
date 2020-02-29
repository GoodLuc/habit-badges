const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const logs = require('./routes/api/logs');

app.use('/api/logs', logs);

// Handle production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/'))

  // Handle SPA
  app.get('/server/', (req, res) => res.sendFile(__dirname + '/server/public/index.html'))
  app.get('/', (req, res) => res.sendFile(__dirname + '/../dist/index.html'))
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`))