const express = require('express');
const fetch = require("node-fetch");
const server = express();

// PORT
const port = 8000

server.use(express.urlencoded({extended: true}));
server.use(express.json());

server.use(express.static(__dirname + '/public'));
server.set('views', './public');
server.set('view engine', 'ejs');

server.get("/", async function(req, res) {
    res.status(200);    
    let dataStudents = await fetch("http://localhost:8080/availableStudents");
    dataStudents = await dataStudents.json();
    let students = dataStudents.map((student) => student.name);
    res.render("views/pages/home.ejs", {students: students});
})

server.get("/student", async (req, res, next) => {
    res.status(200);
    let data = await fetch("http://localhost:8080/students");
    data = await data.json();
    let students = data.map((student) => student.name);
    res.render("views/pages/student.ejs", {students: students})
})

server.get("/history", async (req, res, next) => {
  res.render("views/pages/history")
})

server.get("/assignation", async (req, res, next) => {
  res.render("views/pages/assignation")
})

server.all("*", (req, res) => {
  return res.send('Page not found');
});

server.listen(port)