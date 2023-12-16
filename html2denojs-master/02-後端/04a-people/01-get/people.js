import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
const peoples = new Map();
peoples.set("john", {
  name: "john",
  tel: "082-313345",
});
peoples.set("mary", {
  name: "mary",
  tel: "082-313543",
});
const router = new Router();
router
.get("/", (ctx) => {
  ctx.response.body = "Home";
})
.get("/people", (ctx) => {
  ctx.response.body = Array.from(peoples.values());
})
.get("/people/add", (ctx) => {
  let params = ctx.request.url.searchParams
  let name = params.get('name')
  let tel = params.get('tel')
  console.log(`name=${name} tel=${tel}`)
  if (peoples.get(name)) {
    ctx.response.body = {'error':`name=${name} 已經存在！`}
  } 
  else {
    peoples.set(name, {name, tel})
    ctx.response.type = 'text/html'
    ctx.response.body = `<p>新增 (${name}, ${tel}) 成功</p><p><a href="/people/">列出所有人員</a></p>`
  }
})
.get("/people/find", (ctx) => {
  let params = ctx.request.url.searchParams    
  let name = params.get('name')
  console.log('name=', name)
  if (peoples.has(name)) {
    ctx.response.body = peoples.get(name);
  }
})
  .get("/public/(.*)", async (ctx) => {
    let wpath = ctx.params[0]
    console.log(ctx.params[0])
    await send(ctx, wpath, {
      root: Deno.cwd()+"/public/",
      index: "index.html",
    })
  })

console.log(peoples.get("john").get(name))
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
console.log('start at : http://127.0.0.1:8002')
await app.listen({ port: 8002 });
