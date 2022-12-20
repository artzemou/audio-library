const express = require('express')
const compression = require('compression')
const path = require('path')
const cors = require('cors')
const chalk = require('chalk')
const bodyParser = require('body-parser')
var cron = require('node-cron')
// const client = require('./typesense/client')
const { PORT } = require('./config')
const { User, Audio } = require('./router')

const {collection} = require('./services/collection')

// require('./typesense/audio-library')

cron.schedule('*/5 * * * * *', async () => {
  // console.log(chalk`{green 🥔 Api run on http://localhost:${PORT}}`)
})

express()
  .use(cors())
  .use(compression())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.static(path.join(__dirname, 'build')))
  .use(express.static(path.join(__dirname, 'collections')))
  .use('/user', User)
  .use('/audio', Audio)
  // To Do : refacto search + typesense
  .post('/search', async (req, res) => {
    const {q} = req.body
    const documents = await collection()
    const results = documents.filter(document=> document.path.includes(q))
    res.status(200).json(results)
  })
  .get('/*', (req, res) => {

    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  })

  .listen(PORT, () =>
    console.log(chalk`{green ✅ Api run on http://localhost:${PORT}}`)
  )
