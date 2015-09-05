/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');
var bcrypt = require('bcrypt-nodejs');

module.exports = {
 
  attributes: {
    username: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
    },
	email:{
		type: 'string',
		required: true
	},
	
	firstname: {
		type:  'string'
	},
	
	lastname: {
		type:  'string'
	},
	
	profilepic: {
		type:  'string',
		defaultsTo : '/images/dummy.png'
	},
	
	houseno:{
		type: 'string'
	},
	
	street:{
		type: 'string'
	},
	
	city: {
		type:  'string'
	},
	
	country: {
		type:  'string'
	},
	
	postcode:{
		type: 'string'
	},
	
	aboutme: {
		type:  'string'
		
	},
	
	provider: {
		type: 'string'
	},
	
	uid:{
		type: 'string'
	},
	openid : {
      type : "String"
    },   
	
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },
 
	beforeCreate: function (values, next) {
    UserManager.hashPassword(values.password, null, function (err, password, salt) {
        if (err) return next(err);
        values.password = password;
        values.salt = salt;
        next();
    });
}
 
};
