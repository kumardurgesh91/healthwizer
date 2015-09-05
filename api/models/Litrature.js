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
	
	litraturename:{
		
		type:"string"
	},
	
	tags:{
		  type:"string"
	  },
	
	abstarct:{
		type:"text"
	},
	
	highlight:{
		type:"text"
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
  },
 
  
};