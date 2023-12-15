import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

let notes = [
  {id:0, title:'aaa', body:'aaaaa'},
  {id:1, title:'bbb', body:'bbbbb'},
]

function root(ctx) {
  ctx.response.body = "Hello world!";
}

function getNote(ctx) {
  let id = parseInt(ctx.params.id)
  let {title, body} = notes[id]
  ctx.response.type = 'text/html'
  ctx.response.body = `
    <h1>${title}</h1>
    <p>${body}</p>
  `
}

function listNotes(ctx) {
  let lines = []
  for (let note of notes) {
    lines.push(`
      <li>${note.title}</li>
      <p><a href="/note/${note.id}">Read Note</a></p>
    `)
  }
  ctx.response.type = "text/html"
  ctx.response.body = lines.join('\n')
}

router.get("/", root)
.get("/notes/list", listNotes)
.get("/note/:id", getNote)

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 });
