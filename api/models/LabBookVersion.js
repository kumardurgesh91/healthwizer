module.exports = {
	attributes : {
		projectid : {
			type : 'integer',
			required : true
		},
		createrid : {
			type : 'integer',
			required : true
		},
		creater : {
			type : 'string',
			required : true
		},
		labbookid : {
			type : 'integer',
			required : true
		},
		name : {
			type : 'string',
			defaultsTo : ''
		},
		tags : {
			type : 'string',
			defaultsTo : ''
		},
		description : {
			type : 'string',
			defaultsTo : ''
		},
		abstract : {
			type : 'string',
			defaultsTo : ''
		},
		highlight : {
			type : 'string',
			defaultsTo : ''
		},
		materials : {
			type : 'string',
			defaultsTo : ''
		},
		procedure : {
			type : 'string',
			defaultsTo : ''
		},
		background : {
			type : 'string',
			defaultsTo : ''
		},
		result : {
			type : 'string',
			defaultsTo : ''
		},
		conclusion : {
			type : 'string',
			defaultsTo : ''
		},
		type : {
			type : 'string',
			defaultsTo : ''
		},
		labbooktype : {
			type : 'string',
			required : true
		},
		files : {
			type : 'string',
			defaultsTo : ''
		},
		isStared : {
			type : 'boolean',
			defaultsTo : false
		},
		isDraft : {
			type : 'boolean',
			defaultsTo : false
		},
		isDeleted : {
			type : 'boolean',
			defaultsTo : false
		},
		isArchived : {
	  		type : 'boolean',
	  		defaultsTo : false	
	  }

	}
};