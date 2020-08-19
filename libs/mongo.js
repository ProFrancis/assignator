const MongoClient = require('mongodb').MongoClient

let client;
const MONGO_DBNAME = "tech-watch"
const MONGO_URL = "mongodb://localhost:27017"

connectBdd = async() => {
  try{
    if(!client) {
      client = await MongoClient.connect(MONGO_URL, { useUnifiedTopology: true })
    }
    return client.db(MONGO_DBNAME);
  }catch(err){
    console.error(" ERROR MONGO => ", err)
  }
}

close = () => {
  if(client) {
    client.close()
  }
  client = undefined
}

exports.connectBdd = connectBdd
exports.close = close