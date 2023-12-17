export function layout(title, content) {
  return `
  <html>
  <head>
    <title>${title}</title>
    <style>
      body {
        padding: 80px;
        font: 16px Helvetica, Arial;
      }
  
      h1 {
        font-size: 2em;
      }
  
      h2 {
        font-size: 1.2em;
      }
  
      #posts {
        margin: 0;
        padding: 0;
      }
  
      #posts li {
        margin: 40px 0;
        padding: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
        list-style: none;
      }
  
      #posts li:last-child {
        border-bottom: none;
      }
  
      textarea {
        width: 500px;
        height: 300px;
      }
  
      input[type=text],
      textarea {
        border: 1px solid #eee;
        border-top-color: #ddd;
        border-left-color: #ddd;
        border-radius: 2px;
        padding: 15px;
        font-size: .8em;
      }
  
      input[type=text] {
        width: 500px;
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

export function list(numbers) {
  let list = []
  for (let number of numbers) {
    list.push(`
    <li>
      <h2>${ number.title }</h2>
      <p><a href="/number/${number.id}">通訊錄</a></p>
    </li>
    `)
  }
  let content = `
  <h1>通訊錄</h1>
  <p>目前擁有 <strong>${numbers.length}</strong> 個聯絡人!</p>
  <p><a href="/number/new">創建新的聯絡人</a></p>
  <ul id="numbers">
    ${list.join('\n')}
  </ul>
  `
  return layout('numbers', content)
}
export function newNumber() {
  return layout('New Numbers', `
  <h1>新聯絡人</h1>
  <p>創建新的聯絡人.</p>
  <form action="/number" method="post">
    <p><input type="text" placeholder="姓名" name="title"></p>
    <p><textarea placeholder="號碼" name="body"></textarea></p>
    <p><input type="submit" value="新增"></p>
  </form>
  `)
}
export function show(number) {
  return layout(number.title, `
    <h1>${number.title}</h1>
    <pre>${number.body}</pre>
  `)
}