var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy
	, GoogleSrtategy = require('passport-google-oauth').Strategy
	, LinkdinStrategy = require('passport-linkedin-oauth2').Strategy
    


var verifyHandler = function (token, tokenSecret, profile, done) {
    process.nextTick(function () {

        User.findOne({uid: profile.id}).done(function (err, user) {
                if (user) {
                    return done(null, user);
                } else {

                    var data = {
                        provider: profile.provider,
                        uid: profile.id,
                        name: profile.displayName
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

                    User.create(data).done(function (err, user) {
                            return done(err, user);
                        });
                }
            });
    });
};

passport.serializeUser(function (user, done) {
    done(null, user.uid);
});

passport.deserializeUser(function (uid, done) {
    User.findOne({uid: uid}).done(function (err, user) {
        done(err, user)
    });
});


module.exports = {

    // Init custom express middleware
    express: {
        customMiddleware: function (app) {

            passport.use(new LinkdinStrategy({
                    clientID: "LINKEDIN_API_KEY",
					clientSecret: "LINKEDIN_SECRET_KEY",
					callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback"
                },
                verifyHandler
            ));

            passport.use(new FacebookStrategy({
                    clientID: "YOUR_CLIENT_ID",
                    clientSecret: "YOUR_CLIENT_SECRET",
                    callbackURL: "http://localhost:1337/auth/facebook/callback"
                },
                verifyHandler
            ));
			
			 passport.use(new GoogleSrtategy({
                    clientID : 'your-secret-clientID-here',
					clientSecret 	: 'your-client-secret-here',
					callbackURL	: 'http://localhost:3005/auth/google/callback'
                },
                verifyHandler
            ));

           

            app.use(passport.initialize());
            app.use(passport.session());
        }
    }

};
