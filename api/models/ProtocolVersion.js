/**
 * ...
 * @author Vipul
 */

module.exports = {
 
  attributes: {
	  
	projectid: {
      type: 'integer',
      required: true,
    },
	
	protocolname:{
		
		type:"string"
	},
	
	tags:{
		  type:"string"
	  },
	
	materials:{
		type:"text"
	},
	
	procedure:{
		type:"string"
	},
	
	filename:{
		type: "string"
	},
	
	filepath:{
		   type: "string"
	   },
	   
	  creater:{
		  type: "string"
	  },
	  protocolid : {
	  	type : 'integer'
	  }
  },
 
  
};