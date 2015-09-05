/**
 * ...
 * @author Vipul
 */
//var bcrypt = require('bcrypt-nodejs');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy,
	GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy,
	LinkdinStrategy = require('passport-linkedin-oauth2').Strategy,
  bcrypt = require('bcrypt-nodejs');
 
//helper functions
function findById(id, fn) {
  User.findOne(id).done(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}
 
function findByUsername(username, fn) {
  User.findOne({
    username: username
  }).done(function (err, user) {
    // Error handling
    if (err) {
      return fn(null, null);
      // The User was found successfully!
    } else {
      return fn(null, user);
    }
  });
  
}
 
// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function (id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});
 
// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object.
passport.use(new LocalStrategy(
  function (username, password, done) {
    // asynchronous verification, for effect...
   process.nextTick(function () {
      // Find the user by username. If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message. Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function (err, user) {
        if (err)
          return done(null, err);
        if (!user) {
          return done(null, false, {
            message: 'Unknown user ' + username
          });
        }
        bcrypt.compare(password, user.password, function (err, res) {
          if (!res)
            return done(null, false, {
              message: 'Invalid Password'
            });
          var returnUser = {
            username: user.username,
            createdAt: user.createdAt,
            id: user.id
          };
          return done(null, returnUser, {
            message: 'Logged In Successfully'
          });
        });
      })
    });
	
	
  }
));

var verifyHandler = function (req, token, refreshToken, profile, done) {
    process.nextTick(function () {
		console.log("FROM HERE=====");

        User.findOne({uid: profile.id}).done(function (err, user) {
                if (user) {
                    return done(null, user);
                } else {

                    var data = {
                        provider: profile.provider,
                        uid: profile.id,
                        username : profile.id
                    };

                    if(profile.emails && profile.emails[0] && profile.emails[0].value) {
                        data.email = profile.emails[0].value;
                    }
                    if(profile.name && profile.name.givenName) {
                        data.firstname = profile.name.givenName;
                    }
                    if(profile.name && profile.name.familyName) {
                        data.larstname = profile.name.familyName;
                    }

                    User.create(data).done(function (err, user) {
                            return done(err, user);
                    });
                }
            });
    });
};

    // =========================================================================
    // GOOGLE, linkedin, facebook ==================================================================
    // =========================================================================
    passport.use(new LinkdinStrategy({
          clientID: "75cpkwcc3flogg",
					clientSecret: "qoR1IQrbGV3ef4OJ",
					callbackURL: "http://localhost:2000/auth/linkdin/callback"
                },
                 function(accessToken, refreshToken, profile, done) {
                  
                  process.nextTick(function() {
                    var object = profile._json;
                    User.findOne({uid:object.id}, function(err, user){
                      if(err){
                        return done(err, null);
                      } else if(user){
                        return done(null, user);
                      } else {
                          if(profile.emails[0].value || !profile.emails[0].value == 'undefined'){
                              var user = new Object();
                              user.provider = profile.provider;
                              user.firstname = object.firstName;
                              user.lastname = object.lastName;
                              user.email =  profile.emails[0].value;
                              user.profilepic = object.pictureUrl;
                              user.username = profile.id;
                              user.uid = profile.id

                              createUser(user, function(err, usr){
                              if(err)
                                  {
                                    console.log(err);
                                    return done(err, null);  
                                  }
                                else
                                  return done(null, usr);
                            }); 
                          } else {
                            console.log('in else');
                            return done(null, false, {
                              message: 'email id not found'
                            });
                          }
                      }
                    });
                  });
                }
            ));

    passport.use(new FacebookStrategy({
                    clientID: "580086595433795",
                    clientSecret: "d59fa5037ec2882ed9a2f50bb2c76ada",
                    callbackURL: "http://localhost:2000/auth/facebook/callback",
					passReqToCallback : true
                },
                 function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            User.findOne({ uid : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                       var data = {
                        provider: profile.provider,
                        uid: profile.id,
                        username : profile.displayName
                    };

                        if(profile.emails && profile.emails[0] && profile.emails[0].value) {
                        data.email = profile.emails[0].value;
                    }
                    if(profile.name && profile.name.givenName) {
                        data.fistname = profile.name.givenName;
                    }
                    if(profile.name && profile.name.familyName) {
                        data.lastname = profile.name.familyName;
                    }

                    createUser(data, function(err, usr){
                      if(err)
                        return done(err, null);  
                      else
                        return done(null, usr);
                    }); 
                    }
                });

            }
        );
				 }
  
            ));
			
      function createUser(user,callback){
      User.create(user, function (err, new_usr) {
          if (err){ 
            console.log(err);
            callback(err, null);  
          }else{
            callback(null, new_usr);
          }      
      });
    }

	passport.use(new GoogleStrategy({
                    clientID : '459730061113-b9mjo2j2orgvfi0cf2hka6grle778l8u.apps.googleusercontent.com',
					clientSecret : 'NFEeqqROwIYEG4ekV7jFiAaO',
					callbackURL	: 'http://localhost:2000/auth/google/callback'
                },
                verifyHandler
            ));
