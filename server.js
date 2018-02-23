const express = require('express');

const options = {
  
};

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!'));
}

app.listen(80, () => console.log('[pmxy express] Listening on port 80'));
