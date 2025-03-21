const pool = require('./pool');
/*async function getUser(){

}*/

async function insertUser(name, lastname, email, password) {
     await pool.query("INSERT INTO members (name, surname, email, password, membership) VALUES ($1, $2, $3, $4, false)", [
        name, lastname, email, password
     ])
}



module.exports = {
    insertUser
}