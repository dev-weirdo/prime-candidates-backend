//Import libraries
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
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
    const premiumsCollection = client
      .db("PrimeCandidates")
      .collection("premiums");
    const usersCollection = client.db("PrimeCandidates").collection("users");

    const paymentCollection = client
      .db("PrimeCandidates")
      .collection("payments");
    const usersDataCollection = client
      .db("PrimeCandidates")
      .collection("usersData");
    const reviewsCollection = client
      .db("PrimeCandidates")
      .collection("reviews");
    const experienceCollection = client
      .db("PrimeCandidates")
      .collection("experience");
    const educationCollection = client
      .db("PrimeCandidates")
      .collection("education");
    const resumeNameCollection = client
      .db("PrimeCandidates")
      .collection("resumeName");
    const careerCollection = client.db("PrimeCandidates").collection("career");
    const skillsCollection = client.db("PrimeCandidates").collection("skills");
    const projectsCollection = client
      .db("PrimeCandidates")
      .collection("projects");
    const courseCollection = client.db("PrimeCandidates").collection("course");

    const userCollection = client.db("PrimeCandidates").collection("user");
    const applyCollection = client.db("PrimeCandidates").collection("apply");

    // //User Api
    // app.put("/user/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const user = req.body;
    //   const filter = { email: email };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: user,
    //   };
    //   const result = await userCollection.updateOne(filter, updateDoc, options);
    //   res.send(result);
    // });

    // const supportCollection = client
    //   .db("PrimeCandidates")
    //   .collection("support");

    // const supportCollection = client
    //   .db("PrimeCandidates")
    //   .collection("support");

    // const userProfileCollection = client.db("PrimeCandidates").collection("profile");
    // const coursesCollection = client.db("PrimeCandidates").collection("courses");
    // const supportCollection = client.db("PrimeCandidates").collection("support");

    //All API's goes here
    app.get("/jobs", async (req, res) => {
      const query = {};
      const cursor = jobsCollection.find(query);
      const jobs = await cursor.toArray();
      res.send(jobs);
    });
    app.get("/jobs", async (req, res) => {
      const query = {};
      const cursor = jobsCollection.find(query);
      const jobs = await cursor.toArray();
      res.send(jobs);
    });
    app.delete("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await jobsCollection.deleteOne(query);
      res.send(result);
    });

    //All API's goes here
    app.get("/courses", async (req, res) => {
      const query = {};
      const cursor = coursesCollection.find(query);
      const courses = await cursor.toArray();
      res.send(courses);
    });
    // LOAD SINGLE DATA
    app.get("/courseDetails/:id", async (req, res) => {
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

    app.get("/premiums", async (req, res) => {
      const query = {};
      const cursor = premiumsCollection.find(query);
      const premiums = await cursor.toArray();
      res.send(premiums);
    });

    app.post("/userprofile", async (req, res) => {
      const user = req.body;
      const result = await userProfileCollection.insertOne(user);
      res.send(result);
    });
    app.get("/userProfile", async (req, res) => {
      const query = {};
      const cursor = userProfileCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    // app.get("/premiums/:id", async (req, res) => {
    //   const query = req.query;
    //   const { productId } = query;
    //   const query = { _id: ObjectId(id) };
    //   console.log(query)
    //   const premium = await premiumsCollection.findOne(query);
    //   res.send(premium);
    // });
    app.post("/create-payment-intent", async (req, res) => {
      const service = req.body;
      const price = service.value;
      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({ clientSecret: paymentIntent.client_secret });
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

    app.post("/apply", async (req, res) => {
      const apply = req.body;
      const result = await applyCollection.insertOne(apply);
      res.send(result);
    });
    app.get("/apply", async (req, res) => {
      const query = {};
      const cursor = applyCollection.find(query);
      const apply = await cursor.toArray();
      res.send(apply);
    });
    app.get("/apply/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = applyCollection.find(query);
      const apply = await cursor.toArray();
      res.send(apply);
    });

    app.put("/userprofile", async (req, res) => {
      const user = req.body;

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

    app.get("/userprofile/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userProfileCollection.findOne({ email: email });

      res.send({ data: user });
    });

    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });
    app.get("/review", async (req, res) => {
      const query = {};
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/experience/:email", async (req, res) => {
      const experience = req.body;

      const filter = { email: experience.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: experience,
      };
      const result = await experienceCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    app.get("/experience/:email", async (req, res) => {
      const email = req.params.email;
      const experience = await experienceCollection.findOne({ email: email });

      res.send({ data: experience });
    });
    app.put("/education/:email", async (req, res) => {
      const education = req.body;

      const filter = { email: education.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: education,
      };
      const result = await educationCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    app.get("/education", async (req, res) => {
      const email = req.query.email;

      const query = { email: email };
      const result = await educationCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userProfileCollection.findOne({ email: email });
      const isAdmin = user?.category === "admin";
      res.send({ admin: isAdmin });
    });
    app.get("/employee/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userProfileCollection.findOne({ email: email });
      const isEmployee = user?.category === "employee";
      res.send({ employee: isEmployee });
    });

    app.put("/career/:email", async (req, res) => {
      const career = req.body;

      const filter = { email: career.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: career,
      };
      const result = await careerCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    app.get("/career/:email", async (req, res) => {
      const email = req.params.email;
      const career = await careerCollection.findOne({ email: email });

      res.send({ data: career });
    });
    // app.put("/skills/:email", async (req, res) => {
    //   const skills = req.body;

    //   const filter = { email: skills.email };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: skills,
    //   };
    //   const result = await skillsCollection.updateOne(
    //     filter,
    //     updateDoc,
    //     options
    //   );
    //   res.send(result);
    // })
    app.put("/projects/:email", async (req, res) => {
      const projects = req.body;

      const filter = { email: projects.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: projects,
      };
      const result = await projectsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    // app.post("/projects", async (req, res) => {
    //   const projects = req.body;
    //   const result = await projectsCollection.insertOne(projects);
    //   res.send(result);
    // });
    app.delete("/projects/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await projectsCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/projects/:email", async (req, res) => {
      const email = req.params.email;
      const projects = await projectsCollection.findOne({ email: email });
      res.send({ data: projects });
    });
    app.put("/course/:email", async (req, res) => {
      const course = req.body;

      const filter = { email: course.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: course,
      };
      const result = await courseCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    })
    app.get("/course/:email", async (req, res) => {
      const email = req.params.email;
      const course = await courseCollection.findOne({ email: email });

      res.send({ data: course });
    })
    app.delete("/course/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await courseCollection.deleteOne(query);
      res.send(result);
    })
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
