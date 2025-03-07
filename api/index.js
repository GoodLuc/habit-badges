const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const logs = require("./routes/api/logs");

app.use("/api/logs", logs);

// Handle production
if (process.env.NODE_ENV === "production") {
  // Static folder
  //app.use(express.static(__dirname + '/'))

  // Handle SPA
  //app.get('/', (req, res) => res.sendFile(__dirname + '/client/dist/index.html'))
  //app.get('/server/', (req, res) => res.sendFile(__dirname + '/public/index.html'))

  //app.use('/', express.static(__dirname + '/client/dist/'));
  app.use("/", express.static(__dirname + "/public/"));
}

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
