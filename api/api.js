const bdd = require('../libs/mongo')
const express = require('express')

const api = express()

// PORT
const port = 8080

api.use(express.urlencoded({extended: true}));
api.use(express.json());

available = async () => {
  try{
    const db = await bdd.connectBdd();
    const result = await db.collection('Available_Students').find().toArray()
    return result
  }catch (err){
    console.log(err) 
 } finally{
    bdd.close()
  }
}

api.get('/availableStudents', async (req,res) => {
    const result = await available()
    res.json(result)
})


async function addStudent(element) {
  try {
      const db = await bdd.connectBdd();
      await db.collection("Students").insertOne(element);
      await db.collection("Available_Students").insertOne(element);
  } catch (err) {
      console.log(err);
  } finally {
    bdd.close();
  }
};

api.post("/students", async function(req, res) {
  let newStudent = {
      name: req.body.name
  }
  await addStudent(newStudent);
  res.send();
});

async function getStudents() {
  try {
      const db = await bdd.connectBdd();
      const results = await db.collection("Students").find().toArray();
      return results
  } catch (err) {
      console.log(err);
  } finally {
    bdd.close();
  }
}

api.get("/students", async function(req, res) {
  let students = await getStudents();
  res.json(students);
})

async function deleteStudent(element) {
  try {
      let db = await bdd.connectBdd();
      await db.collection("Students").deleteOne({name: element});
      await db.collection("Available_Students").deleteOne({name: element});
  } catch (err) {
      console.log(err);
  } finally {
      bdd.close();
  }
}

api.delete("/students", function(req, res) {
  deleteStudent(req.body.name);
  res.send();
})



async function refillAvailableStudents() {
  try {
      const db = await bdd.connectBdd();
      const results = await db.collection("Students").find().toArray();
      await db.collection("Available_Students").insertMany(results);
  } catch (err) {
      console.log(err);
  } finally {
      bdd.close();
  }
}

async function deleteFromAvailableStudents(element) {
  try {
      const db = await bdd.connectBdd();
      await db.collection("Available_Students").deleteOne({name: element});
      let availableStudents = await available();
      if (!availableStudents.length) {
        await refillAvailableStudents();
      }
  } catch (err) {
      console.log(err);
  } finally {
      bdd.close();
  }
}


// PROJECTS

async function createGroup(number) {
  let group = [];
  
  for (let i = 0; i < number; i++) {
      let data = await available();
      let students = data.map((student) => student.name);
      let index = Math.floor((Math.random()) * students.length);
      let randomStudent = students[index];
      while (group.includes(randomStudent)) {
          index = Math.floor((Math.random()) * students.length);
          randomStudent = students[index];
      }
      group.push(randomStudent);
      await deleteFromAvailableStudents(students[index]);
      students.splice(index, 1);
  }    

  return group;
}

async function addProject(element) {
  try {
      let db = await bdd.connectBdd();
      await db.collection("Projects").insertOne(element);
  } catch (err) {
      console.log(err);
  } finally {
      bdd.close();
  }
}

api.post("/projects", async function(req, res) {
  let newProject = {
      subject: req.body.subject,
      deadline: req.body.deadline,
      number: parseInt(req.body.number),
      group: await createGroup(parseInt(req.body.number))
  }

  addProject(newProject);
  res.send();
})



async function getProjects() {
  try {
      const db = await bdd.connectBdd();
      const results = await db.collection("Projects").find().toArray();
      return results;
  } catch (err) {
      console.log(err);
  } finally {
      bdd.close();
  }
}

api.get("/projects", async function(req, res) {
  let projects = await getProjects();
  res.json(projects);
})


 
api.listen(port)