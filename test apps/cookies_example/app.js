/*
  http://expressjs.com/api.html#cookieParser
  http://expressjs.com/api.html#res.cookie
  http://expressjs.com/api.html#req.cookies
*/
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
// var router = express.Router();
var session      = require('express-session');

// parses request cookies, populating
// req.cookies and req.signedCookies
// when the secret is passed, used
// for signing the cookies.
app.use(cookieParser());
app.use(session({ secret: 'super-duper-secret-secret' }));
// parses json, x-www-form-urlencoded, and multipart/form-data
app.use(bodyParser());


app.get('/', function(req, res){
  if (req.cookies.remember) {
    res.send('Remembered :). Click to <a href="/forget">forget</a>!.');
  } else {
    res.send('<form method="post"><p>Check to <label>'
      + '<input type="checkbox" name="remember"/> remember me</label> '
      + '<input type="submit" value="Submit"/>.</p></form>');
  }
});

app.get('/forget', function(req, res){
  res.clearCookie('remember');
  res.redirect('back');
});

app.post('/', function(req, res){
  var minute = 60 * 1000;
  if (req.body.remember) res.cookie('remember', 1, { maxAge: minute });
  res.redirect('back');
});


app.listen(8080);
console.log('Express started on port %d', 8080);
