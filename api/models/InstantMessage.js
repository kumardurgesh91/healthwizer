/**
 * ...
 * @author Vipul
 */

module.exports = {
 
  attributes: {
	
	message: {
      type: 'string',
      required: true
    },
	senderid:{
		type:"integer",
		required: true
	},
	recieverid:{
	   type:"integer",
		required: true
	},
	userpair:{
	   type: "string",
	   required : true
	}
  },
};