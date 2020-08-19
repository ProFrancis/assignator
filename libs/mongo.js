var MongoClient = require('mongodb').MongoClient

let client;
var MONGO_DBNAME = "tech-watch"
var MONGO_URL = "mongodb://localhost:27017"

connectBdd = async() => {
  try{
    if(!client) client = await MongoClient.connect(MONGO_URL, { useUnifiedTopology: true })
    return {
      db :client.db(MONGO_DBNAME),
      client: client
    }
  }catch(err){
    console.error(" ERROR MONGO => ", err)
  }
}

close = () => {
  if(client) client.close()
  client = undefined
}

exports.connectBdd = connectBdd
exports.close = close