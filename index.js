//Import libraries
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

//Middlewares
app.use(cors());
app.use(express.json());

//DB connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zmzfmtn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();

    //Collections
    const jobsCollection = client.db("PrimeCandidates").collection("jobs");

    const userProfileCollection = client
      .db("PrimeCandidates")
      .collection("profile");
    const coursesCollection = client
      .db("PrimeCandidates")
      .collection("courses");
    // const supportCollection = client
    //   .db("PrimeCandidates")
    //   .collection("support");

    // const supportCollection = client
    //   .db("PrimeCandidates")
    //   .collection("support");

    //All API's goes here
    app.get("/jobs", async (req, res) => {
      const query = {};
      const cursor = jobsCollection.find(query);
      const jobs = await cursor.toArray();
      res.send(jobs);
    });

    //All API's goes here
    app.get("/courses", async (req, res) => {
      const query = {};
      const cursor = coursesCollection.find(query);
      const courses = await cursor.toArray();
      res.send(courses);
    });
    // LOAD SINGLE DATA
    app.get("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const course = await coursesCollection.findOne(query);
      res.send(course);
    });

    app.get("/jobdetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const job = await jobsCollection.findOne(query);
      res.send(job);
    });

    // app.post("/support", async (req, res) => {
    //   const reason = req.body;
    //   const result = await supportCollection.insertOne(reason);
    //   res.send(result);
    // });

    // app.get("/support", async (req, res) => {
    //   const query = {};
    //   const cursor = supportCollection.find(query);
    //   const support = await cursor.toArray();
    //   res.send(support);
    // });
    app.post("/jobs", async (req, res) => {
      const job = req.body;
      const result = await jobsCollection.insertOne(job);
      res.send(result);
    });

    app.put("/userprofile", async (req, res) => {
      const user = req.body;
      console.log(user);
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userProfileCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.get("/userprofile", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      const result = await userProfileCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
};
run().catch(console.dir);

//Home route
app.get("/", (req, res) => {
  res.send("Hello, Mama! I am running.");
});

//Listening to port
app.listen(port, () => {
  console.log("Server running");
});
