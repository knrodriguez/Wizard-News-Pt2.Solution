const pg = require('pg');

const client = new pg.Client({
    host: 'localhost',
    database: 'wnews',
});

//connect takes a callback function in the event there is an error
//you want to handle
client.connect(err => {
    if(err){
        console.error('connection error!', err.stack)
    } else {
        console.log('Connected to PostgreSQL on port', client.port)
    }
})  

module.exports = client;
