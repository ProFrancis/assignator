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
      let db = await bdd.connectBdd();
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
 
api.listen(port)