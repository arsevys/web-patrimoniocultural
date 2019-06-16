var config = require('./../../../config/config');

const { Pool } = require('pg')


const pool = new Pool(config.DATABASE.PG);

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

module.exports = {
    //solo para una consulta si deseas utilizar
    query: (text, params, callback) => {
      return pool.query(text, params, callback)
    },
    
    //If we need to check out a client from the pool to run sever queries in a row in a transaction
    getClient: (callback) => {
        pool.connect((err, client, done) => {
            const query = client.query.bind(client)

            // monkey patch the query method to keep track of the last query executed
            client.query = () => {
                client.lastQuery = arguments
                client.query.apply(client, arguments)
            }

            // set a timeout of 5 seconds, after which we will log this client's last query
            const timeout = setTimeout(() => {
                console.error('A client has been checked out for more than 5 seconds!')
                console.error(`The last executed query on this client was: ${client.lastQuery}`)
            }, 5000)

            const release = (err) => {
                // call the actual 'done' method, returning this client to the pool
                done(err)

                // clear our timeout
                clearTimeout(timeout)

                // set the query method back to its old un-monkey-patched version
                client.query = query
            }

            callback(err, client, done)
        })
    }
  }
