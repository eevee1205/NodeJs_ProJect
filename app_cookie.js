var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();  //exporess 객체 사용

app.use(cookieParser('12eaefaer1awe'));  //쿠키파서 사용    인자값은 암호화된 쿠키를 해독할수있는 키값
app.listen(3003, function(){
  console.log('3003Port Connected!!');
});

app.get('/count', function(req, res){

  if(req.signedCookies.count){   //req.signedCookies.count 쿠키값 암호화
    var count = parseInt(req.signedCookies.count); //웹브라우저에서 쿠키값으로  count 1 이라는 값 요청
  }else{
    var count = 0;
  }
  count += 1;
  res.cookie('count' , count , {signed:true});
  res.send('Cookie count : ' + req.signedCookies.count); //req 객체의 cookie 데이터중 count 값을 가져온다.
});
//npm install cookie-parser  express 에서 쿠키를 사용할수있는 모듈입니다.


var products = {
  1:{title:'history web 1'},
  2:{title:'history next web'}
};
app.get('/products', function(req, res){
  var output = '';
  for (var name in products){
    output += `
      <li>
        <a href="/cart/${name}">${products[name].title}</a>
      </li>`
  }
    res.send(`<h1>상품목록</h1>
                <ul>${output}</ul>
              <a href="/cart">Cart</a>`);
});

app.get('/cart/:id', function(req, res){
  var id = req.params.id; //request 의 id 값
if(req.signedCookies.cart){  //쿠키에 cart 라는 데이터가 있다면 해당쿠기를 cart 변수에 담는다.
    var cart = req.signedCookies.cart
}else{  //쿠키에 cart 라는 데이터가 없으면 새로운 cart 객체를 생성한다.
    var cart = {};
}
  if(!cart[id]){
    cart[id] = 0;
  }
  cart[id] = parseInt(cart[id])+1;
  res.cookie('cart' , cart, {signed:true});  //cart 쿠키값 세팅
  res.redirect('/cart');
});


app.get('/cart', function(req, res){
  var cart = req.signedCookies.cart;
  if(!cart){
    res.send('Empty Cookie');
  }else{
    var output = '';
    for(var id in cart){
      output += `<li>${products[id].title} (${cart[id]}) </li>`;
    }
    res.send(`
              <h1>Cart</h1>
              <ul>${output}</ul>
              </br>
              <a href="/products">Products List</a>`);
  }

});
