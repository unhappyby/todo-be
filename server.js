require("dotenv").config();

var taskscontroller = require('./app/controller/taskscontroller.js');

var express = require('express');
var app = express();
app.use(express.json());

const PORT = process.env.NODE_DOCKER_PORT || 8080;

taskscontroller(app);

app.get('/', function(request, response) {
    response.send('Deployed!')
});

app.listen(PORT);
console.log("Your Listening to the port " + PORT);