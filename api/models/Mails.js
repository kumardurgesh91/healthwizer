/**
 * ...
 * @author Ankit
 */
module.exports = {
  attributes: {
	subject: {
		type: 'string',
		defaultsTo : "(No-Subject)"
 	},
 	body:{
		type: "string"
   	}, 
   	createrid:{
		type: 'integer',
		required : true
   	},
   	creatername:{
		type: 'string',
   	},
   	to:{
		type: 'string',
   	},
   	cc:{
		type: 'string',
   	},
   	bcc:{
		type: 'string',
   	},
   	category:{
		type: 'string',
		enum: ['urgent', 'magazine', 'family', 'normal']
   	},
   	hasAttachments : {
   		type: 'boolean'
   	},
    isDraft : {
      type : 'boolean',
      defaultsTo : false
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