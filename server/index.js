const compression = require('compression')
const express = require('express')
const morgan = require('morgan')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(compression())

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by')

app.use(morgan('tiny'))
app.use(require('./routes/chat'))
app.use(require('./routes/remix'))

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`)
})
