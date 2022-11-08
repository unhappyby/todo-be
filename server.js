require("dotenv").config();

var taskscontroller = require('./app/controller/taskscontroller.js');

var express = require('express');
var app = express();
app.use(express.json());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next();
  });

const PORT = process.env.NODE_DOCKER_PORT || process.env.PORT;

taskscontroller(app);

app.get('/', function(request, response) {
    response.send('Deployed!')
});

app.listen(PORT, '0.0.0.0');
console.log("Your Listening to the port " + PORT);