require('dotenv').config()
const { Octokit } = require('@octokit/core')
const fsPromises = require('fs').promises
// const client = require('../typesense/client')
const {upsertDocument, deleteDocument} = require('./collection')

const TOKEN = process.env.GITHUB_TOKEN
const OWNER = process.env.GITHUB_OWNER
const REPO = process.env.GITHUB_REPO

const octokit = new Octokit({
  auth: TOKEN,
})

const getSha = async (filename) => {
  try {
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: OWNER,
        repo: REPO,
        path: filename,
      }
    )
    return response.data.sha
  } catch (err) {
    return
  }
}

const getFiles = async () => {
  const options = {
    owner: OWNER,
    repo: REPO,
  }
  return await octokit.request('GET /repos/{owner}/{repo}/contents/', options)
}

const getFile = async (path) => {
  const options = {
    owner: OWNER,
    repo: REPO,
    path,
  }
  return await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    options
  )
}

const deleteFile = async (
  sha = 'fb6a045443fc3a173a1d7d00687856256eadee4f',
  path = 'striptiz.wav'
) => {
  const options = {
    owner: OWNER,
    repo: REPO,
    path: path,
    message: 'Delete file: ' + sha,
    committer: {
      name: 'Benjamin',
      email: 'bfdlmdr@gmail.com',
    },
    sha: sha,
  }

  const response = await octokit.request(
    'DELETE /repos/{owner}/{repo}/contents/{path}',
    options
  )

  if (response.status === 200) {
    // await client.collections('audio_library').documents(sha).delete()
    await deleteDocument(sha)
  }

  return response
}

const uploadFile = async (filename, base64String, sha) => {
  const options = {
    owner: OWNER,
    repo: REPO,
    path: filename,
    message: filename,
    committer: {
      name: 'Benjamin',
      email: 'bfdlmdr@gmail.com',
    },
    content: `${base64String}`,
  }
  if (sha) options.sha = sha
  const response = await octokit.request(
    'PUT /repos/{owner}/{repo}/contents/{path}',
    options
  )

  if (response.status === 201 || 200) {
    let document = response.data.content
    document.id = document.sha
    await upsertDocument(document)
  }

  return response
}

const convertToBase64String = (buffer) => {
  return buffer.toString('base64')
}

const uploadsFiles = async (files) => {
  if (Array.isArray(files)) {
    let filesUploaded = []
    for await (const file of files) {
      const sha = await getSha(file.name.replace(/\.[^/.]+$/, ''))
      const buffer = await fsPromises.readFile(file.path)
      const base64String = convertToBase64String(buffer)
      filesUploaded.push(
        await uploadFile(file.name.replace(/\.[^/.]+$/, ''), base64String, sha)
      )
    }
    return filesUploaded
  } else {
    const file = files
    const sha = await getSha(file.name.replace(/\.[^/.]+$/, ''))
    const buffer = await fsPromises.readFile(file.path)
    const base64String = convertToBase64String(buffer)
    return [
      await uploadFile(file.name.replace(/\.[^/.]+$/, ''), base64String, sha),
    ]
  }
}

// const upsertDocument = async (document) => {
//   client.collections('audio_library').documents().upsert(document)
// }
// const createCollection = async (document) => {
//   const options = {
//     owner: OWNER,
//     repo: REPO,
//   }
//   const response = await octokit.request(
//     'GET /repos/{owner}/{repo}/contents/',
//     options
//   )

//   response.data.forEach((element) => {
//     element.id = element.sha
//   })

//   client
//     .collections('audio_library')
//     .documents()
//     .import(response.data, { action: 'create' })
// }

module.exports = {
  uploadsFiles,
  deleteFile,
  getFiles,
  getFile,
  // createCollection,
}
