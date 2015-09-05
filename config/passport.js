/**
 * ...
 * @author Vipul
 */

	var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	OpenIDStrategy = require('passport-openid').Strategy;
  	FacebookStrategy = require('passport-facebook').Strategy,
	GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy,
	LinkdinStrategy = require('passport-linkedin-oauth2').Strategy,
  	bcrypt = require('bcrypt-nodejs');


	// Use the OpenIDStrategy within Passport.
	// Strategies in passport require a `validate` function, which accept
	// credentials (in this case, an OpenID identifier), and invoke a callback
	// with a user object.
	passport.use(new OpenIDStrategy({
	    returnURL: 'http://localhost:2000/auth/openid/return',
	    realm: 'http://localhost:2000/',
	    profile: true
	  },
	  function(identifier, profile, done) {
	    var object = new Object();

	    if(profile.displayName){
	    	var displayName = profile.displayName.split(" ");
	    	if(displayName.length>0)
        		object.firstname = displayName[0];
        	else
        		object.firstname = profile.displayName;
        		object.username=object.firstname;
        	if(displayName.length>1)
        		object.lastname = displayName[1];
    	}
        //object.type="user";
        if(profile.emails)
            object.email=profile.emails[0].value;       
        object.provider="openid";
        object.username=identifier;
        object.password=identifier;
        console.log("Object = ", object);
        if(object.email){
        	User.findOne({email : object.email, provider : object.provider}, function (err, usr) {
	            if (err) console.log(err);
	            if (usr){            	
	            	if(usr.username != identifier){
		              	usr.username = identifier;
		              	usr.save(function(err){
		                	return done(null, usr);
		              	});
	              	}
	              	else{
	              		return done(null, usr);        
	              	}                        
	            }else{
	              createUser(object, function(err, usr){
	              	if(err)
	                	return done(err, null);  
	                else
	            		return done(null, usr);
	              });         
	            }       
	      	});
        }
        else{
        	return done(err, null);  
        }
	  }
	));




	passport.use(new FacebookStrategy({
                    clientID: "580086595433795",
                    clientSecret: "d59fa5037ec2882ed9a2f50bb2c76ada",
                    callbackURL: "http://localhost:2000/auth/facebook/callback",
					passReqToCallback : true
                },
                 function(req, token, refreshToken, profile, done) {

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
  
    ));



	passport.use(new GoogleStrategy({
	        clientID : '459730061113-b9mjo2j2orgvfi0cf2hka6grle778l8u.apps.googleusercontent.com',
			clientSecret : 'NFEeqqROwIYEG4ekV7jFiAaO',
			callbackURL	: 'http://localhost:2000/auth/google'
	    },
	   function(req, token, refreshToken, profile, done) {
	   		console.log(profile, refreshToken, done);
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

	module.exports = {	
		// Custom express middleware - we use this to register the passport middleware
		express: {
			customMiddleware: function(app) {
				app.use(passport.initialize());
				app.use(passport.session());
			}
		}
	 
	};