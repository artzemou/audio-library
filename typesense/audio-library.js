const client = require('./client')

const schema = {
  "name":"audio_library",
  "fields":[
     {
        "name":"id",
        "type":"string"
     },
     {
        "name":"name",
        "type":"string"
     },
     {
        "name":"path",
        "type":"string"
     },
     {
        "name":"sha",
        "type":"string"
     },
     {
        "name":"size",
        "type":"int64"
     },
     {
        "name":"url",
        "type":"string"
     },
     {
        "name":"html_url",
        "type":"string"
     },
     {
        "name":"git_url",
        "type":"string"
     },
     {
        "name":"download_url",
        "type":"string"
     },
     {
        "name":"type",
        "type":"string"
     }
  ]
}

// client.collections().create(schema)
//   .then( data => {
//     console.log(data)

//   }, err => {
//     console.log(err)
//   });

