import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS Numbers (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT)");



const posts = [
	{id: 0, title: 'aaa', body: 'aaaaa'}, 
  	{id: 1, title: 'bbb', body: 'bbbbb'}
]

const router = new Router()

router
	.get('/', (ctx)=>ctx.response.redirect('/public/index.html'))
	.get('/list', list)
	.get('/post/:id', show)
	.post('/post', create)
	.get('/public/(.*)', pub)

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

function query(sql) {
    let list = []
    for (const [id, title, body] of db.query(sql)) {
      list.push({id, title, body})
    }
    return list
}

async function pub(ctx) {
	console.log('path=', ctx.request.url.pathname)
		await send(ctx, ctx.request.url.pathname, {
		root: `${Deno.cwd()}/`,
		index: "index.html",
	})
}

async function list (ctx) {
	ctx.response.type = 'application/json'
	ctx.response.body = query(`SELECT id, title, body FROM Numbers`)
}

async function show (ctx) {
	const id = ctx.params.id
	const post = query(`SELECT id, title, body FROM Numbers WHERE id=${id}`)
	if (!post) ctx.throw(404, 'invalid post id')
	ctx.response.type = 'application/json'
	ctx.response.body = post
}

async function create (ctx) {
	// var post = ctx.request.body
	const body = ctx.request.body(); // content type automatically detected
	console.log('body = ', body)
	if (body.type === "json") {
		let post = await body.value
		db.query("INSERT INTO Numbers (title, body) VALUES (?, ?)", [post.title, post.body]);
		ctx.response.body = 'success'
	}
}

console.log('Server run at http://127.0.0.1:8001')
await app.listen({ port: 8001 })
















console.log('Server run at http://127.0.0.1:8001')
await app.listen({ port: 8001 })