/**
 * ...
 * @author Vipul
 */
module.exports = {
 
  attributes: {
	  
	discussionid: {
      type: 'integer',
      required : true
 	},
	
	comment:{
		   type: "string"
   	},
	   
  	creatername:{
		  type: "string",
		  required : true
  	},

  	createrid:{
	  type: "integer",
	  required : true
  	},
	  
  },
  
};