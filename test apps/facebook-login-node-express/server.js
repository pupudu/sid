var express           =     require('express')
  , passport          =     require('passport')
  , util              =     require('util')
  , FacebookStrategy  =     require('passport-facebook').Strategy
  , session           =     require('express-session')
  , cookieParser      =     require('cookie-parser')
  , bodyParser        =     require('body-parser')
  , config            =     require('./configuration/config')
  , mysql             =     require('mysql')
  , app               =     express();

var https = require('https');


//Need to change the logic to get the access token for the given ID.
var token = '';

process.env.FACEBOOK_KEY ="KEY-HERE";
process.env.FACEBOOK_SECRET="SECRET-HERE";

//Define MySQL parameter in Config.js file.
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database : config.database
});

var port = process.env.PORT || 8080;

//Connect to Database only if Config.js parameter is set.

if(config.use_database==='true')
{
    connection.connect();
}

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the FacebookStrategy within Passport.

passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret ,
    callbackURL: config.callback_url
  },
  function(accessToken, refreshToken, profile, done) {

    token=accessToken;

    console.log('accessToken: '+accessToken);
    console.log('refreshToken: '+refreshToken);

    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      if(config.use_database==='true')
      {
      connection.query("SELECT * from user_info where user_id="+profile.id,function(err,rows,fields){
        if(err) throw err;
        if(rows.length===0)
          {
            console.log("There is no such user, adding now");
            connection.query("INSERT into user_info(user_id,user_name) VALUES('"+profile.id+"','"+profile.username+"')");
          }
          else
            {
              console.log("User already exists in database");
            }
          });
      }
      console.log(profile._json);

      var fbReq = https.request({
                  hostname: 'graph.facebook.com',
                  method: 'GET',
                  path: '/v2.3/me/friends?access_token=' + accessToken
              }, function(fbRes) {
                var data = '';

                fbRes.on('data', function (chunk) {
                  data += chunk;
                });

                fbRes.on('end', function() {
                  // console.log(data);
                  var jsonPretty = JSON.stringify(JSON.parse(data),null,2);
                  // console.log(jsonPretty);

                  var obj = JSON.parse(data);
                  // for(var i in obj) {
                  //   console.log(i + " (" + obj[i] + ")");
                  // }
                  // console.log("-----------------------");
                  // console.log("name: "+obj.data[0].name);
                  // console.log("id: "+obj.data[0].id);
                  // console.log("-----------------------");

                  // $('#friends').html('new');

                });

              });

              fbReq.on('error', function(err) {
                  console.error(err);
              });

              fbReq.end();

      return done(null, profile);
    });
  }
));


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){

    console.log("XXreq: "+JSON.stringify(req.user));

  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  // console.log("REQ: "+JSON.stringify(JSON.parse(req.user)));
  res.render('account', { user: req.user });
});

app.get('/facebook/friends', ensureAuthenticated, function(req, res){

  var obj = '';
  var data = '';

  var data_name;
  var data_id;

  console.log("Y req"+req);
  console.log("Y req.query"+req.query);
  console.log("Y req.query.id: "+req.query.id);

  console.log("PROCESSING REQUEST");
  var fbReq = https.request({
              hostname: 'graph.facebook.com',
              method: 'GET',
              path: '/v2.3/'+req.query.id+'/friends?access_token=' + token
          }, function(fbRes) {

            fbRes.on('data', function (chunk) {
              data += chunk;
            });

            fbRes.on('end', function() {
              // console.log(data);
              var jsonPretty = JSON.stringify(JSON.parse(data),null,2);
              console.log(jsonPretty);

               obj = JSON.parse(data);
              // for(var i in obj) {
              //   console.log(i + " (" + obj[i] + ")");
              // }
              // console.log("-----------------------");
              // console.log("name: "+obj.data[0].name);
              // console.log("id: "+obj.data[0].id);
              // console.log("-----------------------");

              // console.log("-----------------------");
              // data_name = obj.data[0].name;
              // data_id= obj.data[0].id;
              // console.log("data_name: "+data_name);
              // console.log("data_id: "+data_id);
              // console.log("-----------------------");


              console.log("REQUEST PROCESSED");

              // console.log("-----------------------");
              // console.log("data_name: "+data_name);
              // console.log("data_id: "+data_id);
              // console.log("-----------------------");
              res.json(obj.data);
              console.log("obj.data: "+obj.data);
            });

          });

          fbReq.on('error', function(err) {
              console.error(err);
              res.json({ message: 'Error' });
          });

          fbReq.end();



});

app.get('/auth/facebook', passport.authenticate('facebook',{scope:'email,user_friends'}));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' })
  ,
  function(req, res) {
    res.redirect('/');
  }
  );

// app.get('/success', function(req, res, next) {
//   res.send('Successfully logged in.');
// });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')// /login
}

console.log("PORT: "+port);

app.listen(port);
