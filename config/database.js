const { MongoClient } = require("mongodb");
require('dotenv').config();

const uri = process.env.MONGO_URI;
// console.log("uri:",uri)
const client = new MongoClient(uri);

const DbConnection = async() => {
    try {
        await client.connect();
        console.log("DB Connected Successfully!")
        return client.db('test')
    } catch (error) {
        console.log(`DB Error at:${error.message}`)
    }
}

module.exports = DbConnection;