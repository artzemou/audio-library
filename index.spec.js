const { spawn } = require('child_process');
const request = require('request');
const test = require('tape');

// Start the app
const env = Object.assign({}, process.env, {PORT: 3008});
const child = spawn('node', ['index.js'], {env});

// function sum (a, b) {
//   // your code to make the test pass goes here ...
//   return a + b;
// }

// test('sum should return the addition of two numbers', function (t) {
//   t.equal(3, sum(1, 2)); // make this test pass by completing the add function!
//   t.end();
// });

test('responds to requests', (t) => {
  t.plan(2);

  // Wait until the server is ready
  child.stdout.on('data', _ => {
    // Make a request to our app
    request('http://127.0.0.1:3008', (error, response, body) => {
      // stop the server
      // child.kill();

      // No error
      t.false(error);
      // Successful response
      t.equal(response.statusCode, 200);
      // Assert content checks
      // t.notEqual(body.indexOf("<title>Audio library</title>"), -1);
    });
  });
});
