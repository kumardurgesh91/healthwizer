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
	
	activityusername:{
		   type: "string"
   	},
 	activity:{
			 type: "string"
 	},
		 
 	activitytext:{
		 type: "string"
 	},
	 
	 activitytime:{
		 type: "date"
	 }
  },
 
  
};