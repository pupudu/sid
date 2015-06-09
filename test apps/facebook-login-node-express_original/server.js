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


      if ( accessToken ) {
        get_all_my_facebook_friends(
          accessToken,
          function( err, all_my_friends ) {
            if(err) console.log(err);
            else {
              console.log('All my facebook friends:');
              console.log(all_my_friends);
              console.log(all_my_friends.length);
            }
          }
        );
      }

      return done(null, profile);
    });
  }
));

function get_all_my_facebook_friends( tok_or_url, callback, friends_so_far ) {

  friends_so_far = friends_so_far || [];

  if( tok_or_url.substr(0,4) == 'http' ) url = tok_or_url;
  else url = 'https://graph.facebook.com/me/friends?access_token=' + tok_or_url;

  // we are going to call this recursively, appending the users as we go
  // until facebook decides we don't have anymore friends ( so this shouldn't take long )
  // then we pass that list of friends to the callback

  console.log('fetching... ' + url);
  require('request')(
    url,
    function ( err, resp, body ) {
      var body = JSON.parse(body),
        data = body.data;
        console.log('data: '+data);
      if ( err || body.error ) {
        callback( err || body.error );
      } else {

        if ( data.length > 0 ) {
          // something was returned... keep on keepin on
          while ( next = data.pop() ) {
            friends_so_far.push( next );
            console.log('next: '+next);
          }
          get_all_my_facebook_friends( body.paging.next, callback, friends_so_far );
        } else {
          // we're done! call the callback!
          callback( NULL, friends_so_far );
        }
      }
    }
  );

}


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/auth/facebook', passport.authenticate('facebook',{scope:'email,user_friends,read_custom_friendlists'}));


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
  res.redirect('/login')
}

console.log("PORT: "+port);

app.listen(port);
