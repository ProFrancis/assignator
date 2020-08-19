const db = require('../libs/mongo')
const express = require('express')

let app = express()

// DB MONGO
const mongo = db.connectBdd()

// PORT
const port = 8080

available = async (next) => {
  try{
    const db = await mongo
    const result = db.collection('Available_Students').find().toArray()
    return result
  }catch (err){
    next(err)
  } finally{
    db.close()
  }
}

app.get('/availableStudents', async (req,res, next) => {
    const result = await available(next)
    res.json(result)
})


async function addStudent(element) {
  try {
      let db = await mongo;
      await db.collection("Students").insertOne(element);
      await db.collection("Available_Students").insertOne(element);
  } catch (err) {
      console.log(err);
  } finally {
      db.close();
  }
};

app.post("/students", function(req, res) {
  let newStudent = {
      name: req.body.name
  }
  await addStudent(newStudent);
  res.send();
});

 
app.listen(port)
