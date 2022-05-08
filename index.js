const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');
const config = require('./config');
const dataset = require('./data.json');

let client;

function connect() {
     // Connection configuration
     client = new Client({
          node: 'https://localhost:9200',
          auth: {
               username: config.username,
               password: config.password
          },
          tls: {
               ca: fs.readFileSync('./http_ca.crt'),
               rejectUnauthorized: false
          }
     });

     client.ping()
          .then(res => console.log('connection success', res))
          .catch(err => console.error('wrong connection', err));
}

async function run() {
     // Load data into ES
     const result = await client.helpers.bulk({
          datasource: dataset,
          onDocument(doc) {
               return {
                    index: { _index: 'test_pan2' }
               }
          }
     })
     const count = await client.count({ index: 'test_pan2' })
     console.log(count)

     // Fire the search
     const { hits } = await client.search({
          index: 'test_pan2',
          body: {
               query: {
                    //  match: { quote: 'winter' }
                    "match_all": {}
               }
          }
     })
     console.log("result: ", hits.hits);
}

connect();
run().catch(console.log);