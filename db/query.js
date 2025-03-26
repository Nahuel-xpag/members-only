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
    const slicedDate = date.slice(0,15);  
    await pool.query("INSERT INTO messages (by_user, body, date) VALUES ($1, $2, $3);",[message, user, slicedDate])
}

async function getMembership(user){
  await pool.query("UPDATE members SET membership = true WHERE email = $1;",[user]);
}
module.exports = {
    insertUser,
    insertMessage,
    getMessages,
    getMembership
}