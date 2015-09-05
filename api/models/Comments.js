/**
 * ...
 * @author Vipul
 */
module.exports = {
 
  attributes: {
	  
	projectid: {
      type: 'integer',
 	},
	
	activityID:{
		type:"integer",
		required : true
	},
	
	comments:{
		   type: "string"
   	},
	   
	  creater:{
		  type: "string"
	  },
	  
	  flag:{
		  
		  type:"integer"
	  },
	  
	   
  },
 
  
};