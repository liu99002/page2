import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { viewEngine, ejsEngine, oakAdapter } from "https://deno.land/x/view_engine@v10.5.1/mod.ts"
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, password TEXT)");

const router = new Router();
router
  .get('/', home)
  .get('/user/registerui', registerUI)
  .post('/user/register', register)
  .get('/user/loginui', loginUI)
  .post('/user/login', login)
  .get("/user/logout",logout)
  .get('/public/(.*)', pub)

const app = new Application();
app.use(viewEngine(oakAdapter, ejsEngine));
app.use(Session.initMiddleware())
app.use(router.routes());
app.use(router.allowedMethods());

function query(sql) {
  let list = []
  for (const [id, title, body] of db.query(sql)) {
    list.push({id, title, body})
  }
  return list
}

async function home(ctx) {
  ctx.render("view/home.ejs");
}

async function registerUI(ctx){
  ctx.render("view/registerui.ejs");
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
			ctx.render("view/registererror.ejs",{account});
		}
		else {
			db.query("INSERT INTO Users (account, password) VALUES (?, ?)", [account, password]);
			ctx.render("view/registersuccessful.ejs",{account});
		}
	} 
}

async function loginUI(ctx){
	ctx.render("view/loginui.ejs");
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
				await ctx.state.session.set('user', account)
				console.log('session.user=', await ctx.state.session.get('user'))
				ctx.render("view/loginsuccessful.ejs",{account});
			}
			else{
				ctx.render("view/loginerror.ejs");
			}
		}
		else {
			ctx.render("view/notyet.ejs",{account});
		}
	}
}

async function logout(ctx) {
    await ctx.state.session.set('user', null)
    ctx.render("view/home.ejs");
}

async function pub(ctx) {
  // console.log(ctx.params);
  var path = ctx.params[0]
  await send(ctx, path, {
    root: Deno.cwd()+'/public',
    index: "index.html",
  });
}

let port = parseInt(Deno.args[0])
console.log(`Server run at http://127.0.0.1:${port}`)
await app.listen({ port });