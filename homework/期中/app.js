import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";

const db = new DB("game_data.db");
db.query(`CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account TEXT,
    password TEXT,
    highScore INTEGER
)`);

const router = new Router();
router
    .get("/", (ctx) => {
        ctx.response.redirect('http://127.0.0.1:8030/view/')
    })
    .get("/view/(.*)", async (ctx) => {
        let wpath = ctx.params[0]
        await send(ctx, wpath, {
            root: Deno.cwd() + "/view/",
            index: "home.html",
        })
    })
    .post("/view/register", async (ctx) => {
        const body = ctx.request.body()
        if (body.type == "form") {
            const pairs = await body.value
            const params = {}
            for (const [key, value] of pairs) {
                params[key] = value
            }
            // 获取输入的帐号和密码
            let account = params["account"];
            let password = params["password"];
            const post1 = {}
            for (const [key, value] of db.query("SELECT account, password FROM Users")) {
                post1[key] = value
            }
            if (account in post1) {
                ctx.response.type = 'text/html'
                ctx.response.body = `
                    <form class="register">
                        <link rel="stylesheet" href="home.css">
                        <h1>帳號已被別人使用過！</h1>
                        <h1><a href="/view/registerui.html">重新註冊</a></h1>
                        <h1><a href="/view/loginui.html">登入</a></h1>
                    </form>
                `
            }
            else {
                await db.query("INSERT INTO Users (account, password, highScore) VALUES (?, ?, 0)", [account, password]);
                ctx.response.type = 'text/html'
                ctx.response.body = `
                    <form class="register">
                        <link rel="stylesheet" href="home.css">
                        <h1>註冊成功</h1>
                        <h1><a href="/view/loginui.html">帳號登入</a></h1>
                        <h1><a href="/view/home.html">首頁</a></h1>
                    </form>
                `
            }
        }
    })

    .post("/view/login", async (ctx) => {
        const body = ctx.request.body()
        if (body.type == "form") {
            const pairs = await body.value
            const params = {}
            for (const [key, value] of pairs) {
                params[key] = value
            }
            // 獲取输入的帐号和密码
            let account = params["account"];
            let password = params["password"];
            const post1 = {}
            for (const [key, value] of db.query("SELECT account, password FROM Users")) {
                post1[key] = value
            }
            if (password === post1[account]) {
                await ctx.state.session.set('user', account)
                ctx.response.redirect('/view/game.html')
            }
            else {
                ctx.response.type = 'text/html'
                ctx.response.body = `
                    <form class="login">
                        <link rel="stylesheet" href="home.css">
                        <h1>登入失敗，請檢查帳號密碼是否有錯！</h1>
                        <h1><a href="/view/loginui.html">重新登入</a></h1>
                        <h1><a href="/view/home.html">首頁</a></h1>
                    </form>
                `
            }
        }
    })

    .post('/view/scores',scores_update)

    .post("/view/rankinglist", async (ctx) => {
        let datalist = {};
        const records = db.query("SELECT account, highScore FROM Users");
        // 使用 map 方法遍歷每一列，將其轉換為物件
        datalist = records.map(record => ({
            account: record[0],
            highScore: record[1]
        }));
        datalist.sort((a, b) => b.highScore - a.highScore);

        const result = await db.query("SELECT id FROM Users");
        const ids = result.map(row => row[0]);
        const numberOfIds = ids.length;
        
        console.log(numberOfIds)
        if(numberOfIds>=5){
            ctx.response.type = 'text/html'
            ctx.response.body = `
                <link rel="stylesheet" href="home.css">
                <h4 class="rank">TOP5排行榜</h4>
                <div class="sexyborder">
                    <table class="table" >
                        <tr class="title">
                            <td>名次</td>
                            <td>帳號</td>
                            <td>分數</td>
                        </tr>

                        <tr class="one">
                            <td>1.</td>
                            <td>${datalist[0].account}</td>
                            <td>${datalist[0].highScore}</td>
                        </tr>

                        <tr class="two">
                            <td>2.</td>
                            <td>${datalist[1].account}</td>
                            <td>${datalist[1].highScore}</td>
                        </tr>

                        <tr class="three">
                            <td>3.</td>
                            <td>${datalist[2].account}</td>
                            <td>${datalist[2].highScore}</td>
                        </tr>

                        <tr class="four">
                            <td>4.</td>
                            <td>${datalist[3].account}</td>
                            <td>${datalist[3].highScore}</td>
                        </tr>

                        <tr class="five">
                            <td>5.</td>
                            <td>${datalist[4].account}</td>
                            <td>${datalist[4].highScore}</td>
                        </tr>
                    </table>
                </div>
                <h1 id="return-game"><a href="/view/game.html">返回遊戲</a></h1>
                <h1 id="logout-game"><a href="/view/home.html">遊戲登出</a></h1>
        `}
        else{
            ctx.response.type = 'text/html';
            ctx.response.body = `
                <script>
                    alert("人數不足，請新增玩家");
                    window.location.href = 'http://127.0.0.1:8030/view/game.html';
                </script>`
        }
        

    })
    
async function scores_update(ctx){
    const body=ctx.request.body()
    const value = await body.value
    var player=await ctx.state.session.get('user')
    var beforescore = await db.query("SELECT highScore FROM Users WHERE account = ?",[player])
    if(beforescore<value.score){
        await db.query("UPDATE Users SET highScore = ? WHERE account = ?",[value.score, player]);
    }
}

const app = new Application();
app.use(Session.initMiddleware());
app.use(router.routes());
app.use(router.allowedMethods());
console.log('start at : http://127.0.0.1:8030')
await app.listen({ port: 8030 });