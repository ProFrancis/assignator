const bdd = require('../libs/mongo')
const express = require('express')

const appi = express()

// PORT
const port = 8080

appi.use(express.urlencoded({extended: true}));
appi.use(express.json());

available = async (next) => {
  try{
    const db = await bdd.connectBdd();
    const result = await db.collection('Available_Students').find().toArray()
    return result
  }catch (err){
    next(err)
  } finally{
    bdd.close()
  }
}

appi.get('/availableStudents', async (req,res) => {
    const result = await available(next)
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

appi.post("/students", async function(req, res) {
  let newStudent = {
      name: req.body.name
  }
  await addStudent(newStudent);
  res.send();
});

async function getStudents() {
  try {
      let db = await bdd.connectBdd();
      let results = await db.collection("Students").find().toArray();
      return results;
  } catch (err) {
      console.log(err);
  } finally {
    bdd.close();
  }
}

appi.get("/students", async function(req, res) {
  let students = await getStudents();
  res.json(students);
})

 
appi.listen(port)