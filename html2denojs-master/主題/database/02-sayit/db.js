import { DB } from "https://deno.land/x/sqlite/mod.ts";

let db = null

export function open() {
  db = new DB("main.db");
  db.query(`CREATE TABLE IF NOT EXISTS users 
              (id INTEGER PRIMARY KEY AUTOINCREMENT, 
               user TEXT, pass TEXT, email TEXT)`)
  db.query(`CREATE TABLE IF NOT EXISTS says 
              (id INTEGER PRIMARY KEY AUTOINCREMENT, 
               msg TEXT, ufrom TEXT, uto TEXT, 
               comments TEXT, time INTEGER)`)
}

export function clear() {
  db.query(`DELETE FROM users`)
  db.query(`DELETE FROM says`)
}

export function userAdd(user) {
  db.query(`INSERT INTO users (user, pass, email) 
                       VALUES (?,    ?,  ?)`, 
                       [user.user, user.pass, user.email])
}

export function userList() {
  let q = db.query(`SELECT id, user, pass, email FROM users`, [])
  let users = []
  for (let [id, user, pass, email] of q) {
    users.push({id, user, pass, email})
  }
  return users
}

export function sayAdd(say) {
  db.query(`INSERT INTO says (msg, ufrom, uto, comments, time) 
                      VALUES (?,   ?,     ?,   ?,        ?)`, 
                      [say.msg, say.ufrom, say.uto, say.comments, Date.now()])
}

export function sayBy(uto) {
  let q = db.query(`SELECT id, msg, ufrom, uto, comments, time
            FROM says WHERE uto=?`, [uto])
  let says = []
  for (let [id, msg, ufrom, uto, comments, time] of q) {
    says.push({id, msg, ufrom, uto, comments:JSON.parse(comments), time})
  }
  return says
}

export function close() {
  db.close()
}
