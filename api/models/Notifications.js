/**
 * ...
 * @author Vipul
 */

module.exports = {

  attributes: {
	  username:{
		type: 'string',
      required: true,
      unique: true
	},
	
     notification:{
		type: 'string',
	}
  }
	
};
