const MongoClient = require("mongodb").MongoClient;
const connectionString = 'mongodb://localhost:27017';
const client = new MongoClient(connectionString);
let conn;
var database;
async function connectToDB() {
    if (conn) return conn.db('portfolio');
    try {
        conn = await client.connect();
        database = conn.db('portfolio');
        return database;
    } catch (e) {
        console.error('database connection errror', e);
        throw e;
    }
}
function getDb() {
    return database;
}

module.exports =  {connectToDB, getDb};