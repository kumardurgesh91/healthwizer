/**
 * Tasks
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

	title: {
		 type: 'string'
	},
	description : {
		type : 'string'
	},
	startdate : {
		type : 'date'
	},
	enddate : {
		type : 'date'
	},
	createrid: {
		type: 'integer'
	},
	projectid : {
		type : 'integer'
	},
	isDeleted : {
		type : 'boolean',
		defaultsTo : false
	},
	isCompleted : {
		type : 'boolean',
		defaultsTo : false
	}
  }
};
