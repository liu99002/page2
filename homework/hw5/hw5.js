import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as address from './address.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS Numbers (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT)");

const router = new Router();
router
	.get('/', list)
	.get('/number/new', add)
	.get('/number/:id', show)
	.post('/number', create);

const app=new Application();
app.use(router.routes());
app.use(router.allowedMethods());

function query(sql) {
    let list = []
    for (const [id, title, body] of db.query(sql)) {
      list.push({id, title, body})
    }
    return list
}

async function list(ctx) {
    let numbers = query("SELECT id, title, body FROM Numbers")
    ctx.response.body = await address.list(numbers);
}

async function add(ctx) {
    ctx.response.body = await address.newNumber();
}

async function show(ctx) {
	const pid = ctx.params.id;
	console.log(ctx.params)
	let posts = query(`SELECT id, title, body FROM Numbers WHERE id=${pid}`)
    let post = posts[0]
    if (!post) ctx.throw(404, 'invalid post id');
    ctx.response.body = await address.show(post);
}

async function create(ctx) {
    const body = ctx.request.body()
    if (body.type === "form") {
      const pairs = await body.value
      const post = {}
      for (const [key, value] of pairs) {
        post[key] = value
      }
      db.query("INSERT INTO Numbers (title, body) VALUES (?, ?)", [post.title, post.body]);
      ctx.response.redirect('/');
    }
}

let port = parseInt(Deno.args[0])
console.log(`Server run at http://127.0.0.1:${port}`)
await app.listen({ port });