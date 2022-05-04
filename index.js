const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');
const config  = require('./config');

const client = new Client({
     node: 'https://localhost:9200',
     auth: {
       username: config.username,
       password: config.password
     },
     tls: {
          ca: fs.readFileSync('./http_ca.crt'),
          rejectUnauthorized: false
     }
})

client.ping()
  .then(res => console.log('connection success', res))
  .catch(err => console.error('wrong connection', err));

// client.info()
//   .then(response => console.log(response))
//   .catch(error => console.error(error));

async function run() {
     await client.index({
          index: 'game-of-thrones',
          body: {
          character: 'Ned Stark',
          quote: 'Winter is coming.'
          }
     })

     await client.index({
          index: 'game-of-thrones',
          body: {
          character: 'Daenerys Targaryen',
          quote: 'I am the blood of the dragon.'
          }
     })

     await client.index({
          index: 'game-of-thrones',
          body: {
          character: 'Tyrion Lannister',
          quote: 'A mind needs books like a sword needs whetstone.'
          }
     })

     await client.indices.refresh({index: 'game-of-thrones'})

     const { hits } = await client.search({
            index: 'game-of-thrones',
            body: {
              query: {
                match: { quote: 'winter' }
               // "match_all": {}
              }
            }
          })

     console.log(hits.hits)
}

run().catch(console.log)

// async function update() {
//      await client.update({
//        index: 'game-of-thrones',
//        id: 'hElcioABfWZdDdAw0MnZ',
//        body: {
//          script: {
//            source: "ctx._source.birthplace = 'Winterfell2'"
//          }
//        }
//      })
//      const { _source } = await client.get({
//        index: 'game-of-thrones',
//        id: 'hElcioABfWZdDdAw0MnZ'
//      })
   
//      console.log(_source)
//    }
   
// update().catch(console.log)

