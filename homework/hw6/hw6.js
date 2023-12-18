import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as address from './address.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, password TEXT)");

const router = new Router();
router    
    .get('/', list)
    .get('/user/registerui', registerUI)
    .get('/user/loginui', loginUI)
    .post('/user/register', register)
    .post('/user/login', login);

const app=new Application();
app.use(router.routes());
app.use(router.allowedMethods());
function query(sql) {
    let list = []
    for (const [id, account, password] of db.query(sql)) {
      list.push({id, account, password})
    }
    return list
}    

async function list(ctx) {
    ctx.response.body = await address.list();
}

async function registerUI(ctx){
    ctx.response.body=await address.registerUI();
}

async function loginUI(ctx){
    ctx.response.body=await address.loginUI();
}

async function register(ctx){
    const body = ctx.request.body()
    if (body.type === "form") {
        const pairs = await body.value
        const post = {}
        for (const [key, value] of pairs) {
          post[key] = value
        }
        const post1 = {}
        for (const [key, value] of db.query("SELECT account, password FROM Users")) {
          post1[key] = value
        }
        let account = post["account"]
        let password = post["password"]
        if (account in post1) {
            ctx.response.body=await address.registererror(account);
        }
        else {
            db.query("INSERT INTO Users (account, password) VALUES (?, ?)", [account, password]);
            ctx.response.body=await address.registersuccessful(account);
        }
    } 
}

async function login(ctx){
    const body = ctx.request.body()
    if (body.type === "form") {
        const pairs = await body.value
        const post = {}
        for (const [key, value] of pairs) {
          post[key] = value
        }
        const post1 = {}
        for (const [key, value] of db.query("SELECT account, password FROM Users")) {
          post1[key] = value
        }
        let account = post["account"]
        let password = post["password"]
        if (account in post1){
            if (post1[account]==password){
              await ctx.state.session.set('user', user)
              ctx.response.body=await address.loginsuccessful(account,ctx.state.session);
            }
            else{
              ctx.response.body=await address.loginerror(account);
            }
        }
        else {
          ctx.response.body=await address.notyet(account);
        }
    }
}

let port = parseInt(Deno.args[0])
console.log(`Server run at http://127.0.0.1:${port}`)
await app.listen({ port });


















