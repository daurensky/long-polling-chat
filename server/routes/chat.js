const { Router } = require('express')
const { nanoid } = require('nanoid')
const { MongoClient, ServerApiVersion } = require('mongodb')
const router = new Router()

const client = new MongoClient(process.env.MONGO_DSN, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
const messages = client.db().collection('messages')

const subscribers = {}
const subscriberIps = {}

router.get('/api/messages', async (req, res) => {
  const cursor = messages.find()
  const result = []

  for await (const message of cursor) {
    result.push(message)
  }

  res.json(result)
})

router.get('/api/subscribe', (req, res) => {
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  if (!subscriberIps[ipAddress]) {
    subscriberIps[ipAddress] = nanoid()
  }

  const subscriberId = subscriberIps[ipAddress]
  subscribers[subscriberId] = res

  req.on('close', () => {
    delete subscribers[subscriberId]
  })
})

router.post('/api/publish', async (req, res) => {
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const { userName, text } = req.body

  const errors = [
    !userName && 'Username cannot be empty',
    !text && 'Text cannot be empty',
  ].filter(Boolean)

  if (errors.length > 0) {
    res.json(errors).status(400)
    return
  }

  await client.connect()

  const subscriberId = subscriberIps[ipAddress]

  const message = { userName, subscriberId, text }
  const { insertedId } = await messages.insertOne(message)
  message._id = insertedId

  for (const id in subscribers) {
    subscribers[id].json(message)
  }

  res.send('Message sent!')
})

module.exports = router
