var MongoClient = require('mongodb').MongoClient

var db;
var MONGO_DBNAME = "tech-watch"
var MONGO_URL = "mongodb://localhost:27017"

connectBdd = async() => {
  try{
    if(!db) db = await MongoClient.connect(MONGO_URL, { useUnifiedTopology: true })
    return db.db(MONGO_DBNAME)
  }catch(err){
    console.error(" ERROR MONGO => ", err)
  }
}

close = () => {
  if(db) db.close()
  db = undefined
}

exports.connectBdd = connectBdd
exports.close = close