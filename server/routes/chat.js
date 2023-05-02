const { Router } = require("express");
const { nanoid } = require("nanoid");
const { MongoClient, ServerApiVersion } = require("mongodb");
const router = new Router();

const client = new MongoClient(process.env.MONGO_DSN, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const messages = client.db().collection("messages");

const subscribers = {};

router.get("/api/messages", async (req, res) => {
  const cursor = messages.find();
  const result = [];

  for await (const message of cursor) {
    result.push(message);
  }

  res.json(result);
});

router.get("/api/subscribe", (req, res) => {
  const id = nanoid();

  subscribers[id] = res;
  req.on("close", () => delete subscribers[id]);
});

router.post("/api/publish", async (req, res) => {
  await client.connect();

  await messages.insertOne({ message: req.body.message });

  for (const id in subscribers) {
    subscribers[id].end(req.body.message);
  }

  res.send("Message sent!");
});

module.exports = router;
