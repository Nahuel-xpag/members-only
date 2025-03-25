const pool = require('./pool');
/*async function getUser(){

}*/

async function getMessages(){
  const { rows } = await pool.query("SELECT * FROM messages;");
  if(rows){
    return {rows}
  }else {
    return false
}
}

async function insertUser(name, lastname, email, password) {
     await pool.query("INSERT INTO members (name, surname, email, password, membership) VALUES ($1, $2, $3, $4, false)", [
        name, lastname, email, password
     ])
}
async function insertMessage(message, user, time){
    const date = time.toISOString();
    await pool.query("INSERT INTO messages (by_user, body, date) VALUES ($1, $2, $3);",[message, user, date])
}


module.exports = {
    insertUser,
    insertMessage,
    getMessages
}