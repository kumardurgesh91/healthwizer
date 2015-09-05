module.exports = {
	attributes : {
		labbookid : {
			type : 'integer',
			required : true
		},
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
		comment : {
			type : 'string',
			required : true
		},
		isDeleted : {
			type : 'boolean',
			defaultsTo : false
		}
	}
}