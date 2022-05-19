const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');
const config = require('./config');
const dataset = require('./data.json')

let client;

// Connect to ES
async function connect() {
     console.log("Connecting...");
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
     await client.ping()
          .then(res => console.log('connection success', res))
          .catch(err => console.error('wrong connection', err));
}

// Indexing
async function index() {
     console.log("Indexing...");
     // Bulk operation
     const bulk = await client.helpers.bulk({
          datasource: dataset,
           // Load the dataset into ES
          onDocument(doc) {
               return {
                    create: {
                         _index: 'test_pan2',
                         _id: doc.id
                    },
               }
          },
          refreshOnCompletion: true
     });
     const count = await client.count({ index: 'test_pan2' })
     console.log(count)
     console.log("Bulk result: ", bulk);
}

// Searching
async function search() {
     console.log("Searching...");
     // Fire the search
     const result = await client.helpers.search({
          index: 'test_pan2',
          query: {
               //  match: { quote: 'winter' }
               "match_all": {}
          }
     })
     console.log("result: ", result);
}

// ---- Run the App ----
connect()
.then(() => index())
.then(() => search())
.catch((e) => console.log(e));
