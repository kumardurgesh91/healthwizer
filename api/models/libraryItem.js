

module.exports = {
 
  attributes: {
	
	type:{
		type:"string"
	},
	
	name:{
		   type: "string"
	   },
	creater:{
		  type: "string"
	  },  
	projectid : {
		type : 'integer',
		defaultsTo : 0
	},
	parentid : {
		type : 'integer',
		defaultsTo : 0
	}
  },
 
};