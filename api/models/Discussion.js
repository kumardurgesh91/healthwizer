/**
 * ...
 * @author Ankit
 */
module.exports = {
 
  attributes: {

	projectid: {
      type: 'integer',
		required : true
 	},
 	
 	description:{
		type: "string",
		required : true
   	},

	title:{
		type: "string",
		required : true
   	},

	creatername:{
		type: "string",
		required : true
	},

	createrid:{
		type:"integer",
		required : true
	},

  },

};