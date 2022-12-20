const fs = require('fs')

const { readFile, writeFile } = require('fs').promises

const COLLECTION_NAME = 'audio-library'
const COLLECTION_DIRECTORY ='collections'
const COLLECTION_PATH = `${COLLECTION_DIRECTORY}/${COLLECTION_NAME}.json`

const collection = async () => {
  return await readFile(COLLECTION_PATH).then(json => JSON.parse(json)).catch(() => null);
}

// create or update
const upsertDocument = async (document) => {
  const {sha} = document
  const data = await readFile(COLLECTION_PATH)
  const json = JSON.parse(data).filter(document => document.sha !== sha)
  json.push(document)
  await writeFile(COLLECTION_PATH, JSON.stringify(json))

  return
}

const deleteDocument = async (sha) => {
  const data = await readFile(COLLECTION_PATH)
  const json = JSON.parse(data).filter(document => document.sha !== sha)
  await writeFile(COLLECTION_PATH, JSON.stringify(json))
  return
}

const createCollection = async (documents) => {
  await writeFile(
    COLLECTION_PATH,
    JSON.stringify(documents)
  )
  return
}

module.exports = { collection, upsertDocument, deleteDocument, createCollection }
