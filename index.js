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

server.get('/api/zoos', (req, res) => {
  db.select()
  .from('zoos')
  .then(zoo => {
    res.status(201).json(zoo)
  })
  .catch(() => {
    res.status(500).send('We could not retrieve this table')
  })
})

server.get('/api/zoos/:id', (req, res) => {
  const {id} = req.params
  db.select()
  .from('zoos')
  .where({id})
  .then(zoo => {
    res.status(201).json(zoo)
  })
  .catch(() => {
    res.status(500).send('We could not retrieve a zoo at that id')
  })
})

server.delete('/api/zoos/:id', (req, res) => {
  const {id} = req.params
  db('zoos')
  .where({id})
  .del()
  .then(zoo => {
    res.status(201).json(zoo)
  })
  .catch(() => {
    res.status(404).send('We could not delete this zoo')
  })
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
