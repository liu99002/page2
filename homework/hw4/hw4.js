import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
const accountpassword = new Map();
accountpassword.set("liu99002", {
    account: "liu99002",
    password: "liu99002",
  });
const router = new Router();
router
    .get("/", (ctx) => {
        ctx.response.type = 'text/html'
        ctx.response.body = `<p><a href="/public/">開始</a></p>`
    })
    .get("/public/(.*)", async (ctx) => {
        let wpath = ctx.params[0]
        console.log('wpath=', wpath)
        await send(ctx, wpath, {
        root: Deno.cwd()+"/public/",
        index: "index.html",
        })
    })
    .post("/account/register", async (ctx) => {
        const body = ctx.request.body()
        console.log('body=', body.value)
        if (body.type === "form") {
            const pairs = await body.value
            console.log('pairs=', pairs)
            const params = {}
            for (const [key, value] of pairs) {
                params[key] = value
            }
            console.log('params=', params)
            let account = params["account"]
            let password = params["password"]
            console.log(`account=${account} password=${password}`)
            console.log(accountpassword.get(account))
            if (accountpassword.get(account)) {
                ctx.response.type = 'text/html'
                ctx.response.body =`
                    <p>Account=${account} 帳號已被別人使用過！</p>
                    <p><a href="/public/register.html">帳號註冊</a></p>
                    <p><a href="/public/">首頁</a></p>
                `
            }
            else {
                accountpassword.set(account, {account, password})
                console.log(accountpassword)
                ctx.response.type = 'text/html'
                ctx.response.body = `
                    <p>註冊成功</p>
                    <p><a href="/public/login.html">帳號登入</a></p>
                    <p><a href="/public/register.html">繼續註冊</a></p>
                    <p><a href="/public/">首頁</a></p>
                `
            }
        } 
        
    })
    .post("/account/login", async (ctx) => {
        const body1 = ctx.request.body()
        console.log('body=', body1.value)
        if (body1.type === "form") {
            const pairs1 = await body1.value
            console.log('pairs=', pairs1)
            const params1 = {}
            for (const [key, value] of pairs1) {
                params1[key] = value
            }
            console.log('params=', params1)
            let accounts = params1["account"]
            let passwords = params1["password"]
            console.log(`account=${accounts} password=${passwords}`)
            console.log(accountpassword.get(accounts))
            const check=accountpassword.get(accounts)
            if (accountpassword.get(accounts)){
                if(accounts==check.account&&passwords==check.password){
                    ctx.response.type = 'text/html'
                    ctx.response.body =`
                        <p>登入成功</p>
                        <p>進入系統</p>
                        <p><a href="/public/">首頁</a></p>
                    `
                }
                else {
                    ctx.response.type = 'text/html'
                    ctx.response.body = `
                        <p>登入失敗，請檢查帳號密碼是否有錯！</p>
                        <p><a href="/public/login.html">重新登入</a></p>
                        <p><a href="/public/">首頁</a></p>
                    `
                }
            }
            else {
                ctx.response.type = 'text/html'
                ctx.response.body = `
                    <p>登入失敗，請檢查帳號密碼是否有錯！</p>
                    <p><a href="/public/login.html">重新登入</a></p>
                    <p><a href="/public/">首頁</a></p>
                `
            }
        } 
        
    })
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 });













