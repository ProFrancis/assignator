const db = require('../libs/mongo')
const express = require('express')

let app = express()

// DB MONGO
const mongo = db.connectBdd()

// PORT
const port = 8080

app.get('/availableStudents', async (req,res, next) => {
    const result = await available(next)
    res.json(result)
})

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
 
app.listen(port)
