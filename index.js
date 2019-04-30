const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const server = express();
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3'
  },
  useNullAsDefault: true,
});

server.use(express.json());
server.use(helmet());

// endpoints here

server.post('/api/zoos', (req, res) => {
  const zooName = req.body
  if(zooName) {
    db.insert(zooName)
    .into('zoos')
    .then(ids => {
      res.status(201).json(ids[0])
    })
    .catch(() => {
      res.status(500).send('System had a problem adding the new zoo')
    })
  } else {
    return res.status(404).json({error: 'Please insert a zoo name'})
  }
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
