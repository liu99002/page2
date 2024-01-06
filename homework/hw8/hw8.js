import { Application, send } from "https://deno.land/x/oak/mod.ts";
import { WebSocketServer } from "https://deno.land/x/websocket/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS Numbers (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT)");

const app = new Application()

const posts = [{id: 0, title: '劉銓旭', body: '0900123456'}, {id: 1, title: '蔡雨軒', body: '0911123456'}]

const wss = new WebSocketServer(8080);

wss.on("connection", function (ws) {
	ws.on("message", function (message) {
    var id, post, msg = JSON.parse(message)
    switch (msg.type) {
      case 'list':
        ws.send(JSON.stringify({type: 'list', posts}))
        break
      case 'show':
        id = msg.post.id
        post = posts[id]
        ws.send(JSON.stringify({type: 'show', post}))
        break
      case 'create':
        post = msg.post
        id = posts.push(post) - 1
        post.created_at = new Date()
        post.id = id
        ws.send(JSON.stringify({type: 'create', post}))
        break
    }
	});
});

app.use(async (ctx, next) => {
  await next()
  console.log('path=', ctx.request.url.pathname)
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}/public/`,
    index: "index.html",
  })
})

console.log('Server run at http://127.0.0.1:8002')
await app.listen({ port: 8002 })
