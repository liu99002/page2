Deno.readTextFile('./hello.txt').then(function (text) {
  console.log(text)
})
/*
f(function callback() {
   g(function callback() {
     h(function callback() {
       
     })
   })
})
*/