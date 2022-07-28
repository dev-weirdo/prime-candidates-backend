//Import libraries
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

//Middlewares
app.use(cors());
app.use(express.json());

//DB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zmzfmtn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();

        //Collections
        const jobsCollection = client.db('PrimeCandidates').collection('jobs');


        //All API's goes here
        app.get('/jobs', async (req, res) => {
            const query = {};
            const cursor = jobsCollection.find(query);
            const jobs = await cursor.toArray();
            res.send(jobs);
        })
    }
    finally {

    }
}
run().catch(console.dir);


//Home route
app.get('/', (req, res) => {
    res.send('Hello, Mama! I am running.');
})

//Listening to port
app.listen(port, () => {
    console.log('Server running');
})