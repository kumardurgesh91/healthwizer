/**
 * ...
 * @author Ankit
 */
module.exports = {
  attributes: {
  	mailid: {
		type: 'integer',
		required : true
 	},
	sentby: {
		type: 'integer',
		required : true
 	},
 	sendername: {
		type: 'string',
		required : true
 	},
 	sentAs: {
	    type: 'string',
	    enum: ['to', 'cc', 'bcc']
  	},
 	sentto:{
		type: 'integer',
		required : true
   	},
   	recievername:{
		type: 'string',
		required : true
   	},
   	isUnread:{
		type: 'string',
	    enum: ['read', 'unread']
   	}, 
   	isImportant:{
		type: 'boolean',
   	},
   	isDeleted : {
   		type : 'boolean',
   		defaultsTo : false
   	},
   	isTrashed : {
      type : 'boolean',
      defaultsTo : false
    }	
  },
};