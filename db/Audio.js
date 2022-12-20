const router = require('express').Router()
const { getFiles, getFile } = require('../services/octokit')
const formidable = require('formidable')
const { uploadsFiles, deleteFile } = require('../services/octokit')
const connection = require('./connection')
const { verifyToken } = require('../services/authJwt')
const {createCollection} =require('../services/collection')

// TO do Delete db
router
  .get('/', async (req, res) => {
    const {status, data} = await getFiles()
    // createCollection(data)
    return res.status(status).json(data)
  })
  .get('/:path', async (req, res) => {
    const path = req.params.path
    try {
      const result = await getFile(path)
      console.log(result)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(error.status).json(error)
    }
  })
  .post('/', verifyToken, (req, res) => {
    const form = new formidable.IncomingForm()
    form.multiples = true

    form.on('error', (err) => {
      throw err
    })

    form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err)
        return
      }
      const filesUploaded = await uploadsFiles(files['uploads[]'])
      for await (const file of filesUploaded) {
        const {
          data: { content },
        } = file
        connection.query(
          'REPLACE INTO audio_library SET ? ',
          {
            id: content.id,
            user_id: req.userId,
            github_api_data: content,
          },
          (error) => {
            if (error) throw error
          }
        )
      }

      return res.status(200).json({
        message:
          filesUploaded.length > 1 ? 'Files uploaded.' : 'File uploaded.',
          data: filesUploaded.map((file) => file.data.content),
      })
    })
  })
  .delete('/', async (req, res) => {
    const { sha, path } = req.body
    await deleteFile(sha, path)
    connection.query(
      'DELETE FROM audio_library WHERE id = ?',
      [sha],
      (error, results) => {
        if (error) throw error
      }
    )
    return res.status(200).json({
      message: 'File has been deleted successfully.',
    })
  })

module.exports = router
