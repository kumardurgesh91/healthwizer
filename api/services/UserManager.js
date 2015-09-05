/**
 * ...
 * @author Vipul
 */
var bcrypt = require('bcrypt-nodejs');

function hash(value, salt, done) {
    salt = salt || bcrypt.genSaltSync();

    bcrypt.hash(value, salt, null, function (err, hash) {
        if (err) return done(err);

        done(null, hash, salt);
    });
}
module.exports = {
    hashPassword: function (password, salt, done) {
        hash(password, salt, function (err, hashedPassword, salt) {
            if (err) return done(err);

            done(null, hashedPassword, salt);
        });
    },
	authenticateUserPassword: function (username, password, done) {
        User
            .findOne({ username: username })
            .done(function (err, user) {
                if (err) return done(err);
                if (!user || user.locked) return done();

                user.validatePassword(password, function (vpErr, isValid) {
                    if (vpErr) return done(vpErr);

                    if (!isValid)
                    {
                        updateUserLockState(user, function (err) {
                            if (err) return done(err);

                            return done();
                        });
                    }
                    else {
                        return done(null, user);
                    }
                });
            });
    }
};