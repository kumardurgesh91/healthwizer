/**
 * ...
 * @author Ankit
 */
module.exports = {

  attributes: {

	owner: {
		type: 'integer',
		required : true
 	},

 	projectid: {
		type: 'integer',
		required : true
 	},

 	colaborator: {
		type: 'string',
		required : true
 	},
 	
 	colaboratorid: {
		type: 'integer'
 	},
 	accepted: {
		type: 'boolean',
		required : true
 	},

 	status : {
 		type : 'integer',
 		required : true,
 	},

 	message : {
 		type : 'string'
 	}, 

	subject : {
 		type : 'string'
 	}, 


  },

};