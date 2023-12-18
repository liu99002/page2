export function layout(title, content) {
    return `
    <html>
        <head>
            <title>${title}</title>
            <style>
                @charset "UTF-8";
                form,h{
                    width: 400px;
                    border: 6px solid rgba(0, 0, 0, 0.128)  ;
                    border-width: 50%;
                    border-radius: 12px;
                    font-size: larger;
                    background-color: rgba(0, 0, 0, 0.128)  ;
                    margin: 80px 550px;
                }
                input,h{
                    margin: 8px 0;
                    padding: 12px 20px;
                    border: 3px solid rgba(0, 0, 0, 0.623);
                    border-radius: 4px;
                }
                input:focus{
                    background-color: rgba(0, 0, 0, 0.3);
                }
                form,input,select,option,h1,h2{
                    text-align: center;
                    font-family: "Lucida Handwriting",Cursive;
                    font-style: italic;
                }    
                body,h{
                    background-repeat: no-repeat;
                    background-position:center;
                    background-size: cover;
                }
                h1 ,h2{
                    font-size: 2em;
                }
            </style>
        </head>
        <body>
        <section id="content">
            ${content}
        </section>
        </body>
    </html>
    `
}

export function list() {
    return layout('Start',`
        <form>
            <h1><a href="/user/registerui">帳號註冊</a></h1>
            <h2><a href="/user/loginui">帳號登入</a></h2>
        </form>
    `)
}

export function registerUI() {
    return layout('Register',`
        <form action="/user/register" method="post">
            <h1>帳號註冊</h1>
            <input name="account" type="text" placeholder="帳號"><br>
            <input name="password" type="text" placeholder="設定密碼"><br>
            <input name="email" type="text" placeholder="電子信箱"><br>
            <input type="submit" value="註冊">
        </form>
    `)
}

export function registererror(account) {
    return layout('registererror',`
        <form method="get">
            <p>Account:${account} 帳號已被別人使用過！</p>
            <p><a href="/user/registerui">重新註冊</a></p>
            <p><a href="/">首頁</a></p>
        </form>
    `)
}

export function registersuccessful(account) {
    return layout('Registersuccessful',`
        <form method="get">
            <p>註冊成功</p>
            <p><a href="/user/loginui">帳號登入</a></p>
            <p><a href="/user/registerui">繼續註冊</a></p>
            <p><a href="/">首頁</a></p>
        </form>
    `)
}

export function loginUI() {
    return layout('Login',`
        <form action="/user/login" method="post">
            <h1>帳號登入</h1>
            <input name="account" type="text" placeholder="帳號"><br>
            <input name="password" type="text" placeholder="密碼"><br>
            <input type="submit" value="登入">
        </form>
    `)
}

export function notyet() {
    return layout('Not yet',`
        <form>
            <h1>帳號未註冊</h1>
            <p><a href="/user/loginui">重新登入</a></p>
            <p><a href="/user/registerui">帳號註冊</a></p>
        </form>
    `)
}

export function loginsuccessful(account,user) {
    return layout('Loginsuccessful',`
        <form>
            <h1>登入成功</h1>
            <h2>歡迎${user}登入</h2>
            <p><a href="/user/registerui">帳號註冊</a></p>
            <p><a href="/">首頁</a></p>
        </form>
    `)
}

export function loginerror() {
    return layout('Loginerror',`
        <form>
            <h1>密碼錯誤</h1>
            <p><a href="/user/loginui">重新登入</a></p>
            <p><a href="/">首頁</a></p>
        </form>
    `)
}
