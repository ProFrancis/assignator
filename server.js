const express = require('express');
const fetch = require("node-fetch");
const server = express();

server.use(express.urlencoded({extended: true}));
server.use(express.json());

server.use(express.static("public"));
server.set('view engine', 'ejs');

server.get("/", async function(req, res) {
    res.status(200);    
    let dataStudents = await fetch("http://localhost:8080/availableStudents");
    dataStudents = await dataStudents.json();
    let students = dataStudents.map((student) => student.name);
    res.render("home.ejs", {students: students});
})