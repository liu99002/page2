import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as address from './address.js'
const numbers=[
  {id:0, title:"許源成", body:"0987000111"},
  {id:1, title:"范紀綸", body:"0958123456"}
];
const router=new Router();
router.get('/', list)
  .get('/number/new', add)
  .get('/number/:id', show)
  .post('/number', create);
const app=new Application();
app.use(router.routes());
app.use(router.allowedMethods());
async function list(ctx) {
  ctx.response.body = await address.list(numbers);
}
async function add(ctx) {
  ctx.response.body = await address.newNumber();
}
async function show(ctx) {
  const id = ctx.params.id;
  const number = numbers[id];
  if (!number) ctx.throw(404, 'invalid post id');
  ctx.response.body = await address.show(number);
}
async function create(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    const pairs = await body.value
    const number = {}
    for (const [key, value] of pairs) {
      number[key] = value
    }
    console.log('post=', number)
    const id = numbers.push(number) - 1;
    number.created_at = new Date();
    number.id = id;
    ctx.response.redirect('/');
  }
}
console.log('Server run at http://127.0.0.1:8000')
await app.listen({ port: 8000 });