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

server.post("/students", async function(req, res) {
    res.status(200);
    let objet = {
        name: req.body.name
    }
    console.log("POST SERVER STUDENTS")
    await fetch("http://localhost:8080/students", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(objet)});
    res.redirect("/student");
})

server.post("/deleteStudents", async function(req, res) {
    res.status(200);
    let objet = {
        name: req.body.name
    }
    await fetch("http://localhost:8080/students", {method: "DELETE", headers: {"Content-Type": "application/json"}, body: JSON.stringify(objet)});
    res.redirect("/student");
})

server.get("/history", async (req, res, next) => {
    res.status(200);
    let nextProjects = await getNextProjects();
    let previousProjects = await getPreviousProjects();
    res.render("views/pages/history", {nextProjects: nextProjects, previousProjects: previousProjects})
})

server.get("/assignation", async (req, res, next) => {
    res.status(200);
    let projects = await getNextProjects();
    res.render("views/pages/assignation", {projects: projects, error: null})
})

server.post("/projects", async function(req, res) {
    res.status(200);
    let students = await fetch ("http://localhost:8080/students");
    students = await students.json();
    if (students.length >= parseInt(req.body.number)) {
        let objet = {
            subject: req.body.subject,
            deadline: req.body.deadline,
            number: req.body.number
        }
        await fetch("http://localhost:8080/projects", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(objet)});
        res.redirect("/assignation");
    } else {
        let projects = await getNextProjects();
        res.render("views/pages/assignation", {projects: projects, error: "Not enough students"})
    }   
})

server.all("*", (req, res) => {
  return res.send('Page not found');
});

async function getPreviousProjects() {
    let dataProjects = await fetch("http://localhost:8080/projects");
    let projects = await dataProjects.json();
    let previous = projects.filter((project) => Date.parse(project.deadline) < Date.now());
    previous = previous.sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline));
    return previous;
}

async function getNextProjects() {
    let dataProjects = await fetch("http://localhost:8080/projects");
    let projects = await dataProjects.json();
    let next = projects.filter((project) => Date.parse(project.deadline) >= Date.now());
    next = next.sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline));
    return next;
}

server.listen(port)