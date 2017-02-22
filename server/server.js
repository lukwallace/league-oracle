const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello!');
});

// Used for testing
if (module.parent) {
  module.exports = app;
} else {
  console.log('Listening on port 8080!');
  app.listen(8080);
}
