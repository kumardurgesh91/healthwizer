/**
 * ...
 * @author Vipul
 */
module.exports = {
 
  attributes: {
	username: {
      type: 'string',
      required: true,
      unique: true
    },
	
	projectId:{
		    type: "integer"
	   },
	 isAdmin:{
			 type: "integer"
		 },
		 
	 projectname:{
		 type: "string"
	 }
		 
	   
  },
 
  
};