/**
 * ...
 * @author Vipul
 */

module.exports = {
	
 
  attributes: {
	  
	projectname: {
      type: 'string',
      required: true,
      unique: true
    },
	
	username:{
		type:"string"
	},
	
	abstract:{
		   type: "string"
	   },
 	isPrivate:{
	 	type: "boolean"
 	},
		 
	isAdmin:{
		type:"boolean"
	},
		 
	projectType:{
		type: "string"
	},
		 
	projectTypeID:{
		type: "integer"
 	},
	 
 	projectdesc:{
 		type: "text",
		required: true
 	}
	   
  },
 
  
};