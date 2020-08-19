const bdd = require('../libs/mongo')
const express = require('express')

const app = express()

// PORT
const port = 8080

app.use(express.urlencoded({extended: true}));
app.use(express.json());

available = async () => {
  try{
    const db = await bdd.connectBdd();
    const result = await db.collection('Available_Students').find().toArray()
    return result
  }catch (err){
    // next(err)
  } finally{
    bdd.close()
  }
}

app.get('/availableStudents', async (req,res) => {
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

app.post("/students", async function(req, res) {
  let newStudent = {
      name: req.body.name
  }
  await addStudent(newStudent);
  res.send();
});

 
app.listen(port)
